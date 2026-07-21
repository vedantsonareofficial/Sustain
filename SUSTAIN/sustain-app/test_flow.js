const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForProfile(authId, role, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    const { data: userRow, error: userErr } = await supabase
      .from("users")
      .select("id, role, full_name")
      .eq("auth_id", authId)
      .maybeSingle();
    if (userErr) throw userErr;
    if (userRow) {
      const table = role === "organizer" ? "organizers" : "ngos";
      const { data: profileRow, error: profileErr } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", userRow.id)
        .maybeSingle();
      if (profileErr) throw profileErr;
      if (profileRow) return { userRow, profileRow };
    }
    await sleep(500);
  }
  throw new Error(`Trigger did not create ${role} profile within timeout`);
}

async function runTest() {
  const ts = Date.now();
  const organizerEmail = `org-${ts}@sustain.org`;
  const ngoEmail = `ngo-${ts}@sustain.org`;
  const password = "Password123!";

  console.log("\n=== STEP 1: Organizer signup (trigger creates profile) ===");
  const { data: orgAuth, error: orgAuthErr } = await supabase.auth.signUp({
    email: organizerEmail,
    password,
    options: {
      data: {
        full_name: `Organizer Test ${ts}`,
        role: "organizer",
        organization_name: `Sustain Org ${ts}`,
        contact_phone: "+919876543210",
        city: "Mumbai",
      },
    },
  });
  if (orgAuthErr) throw orgAuthErr;
  if (!orgAuth.user?.id) throw new Error("Organizer auth user missing");

  if (orgAuth.session) await supabase.auth.setSession(orgAuth.session);

  const { userRow: orgUser, profileRow: orgProfile } = await waitForProfile(
    orgAuth.user.id,
    "organizer"
  );
  console.log("PASS: users row created:", orgUser.id, orgUser.role);
  console.log("PASS: organizers row created:", orgProfile.id, orgProfile.organization_name);

  console.log("\n=== STEP 2: Post surplus listing ===");
  const todayStr = new Date().toISOString().split("T")[0];
  const { data: eventRow, error: eventErr } = await supabase
    .from("events")
    .insert({
      organizer_id: orgProfile.id,
      event_date: todayStr,
      location: "Mumbai Main Center",
      status: "active",
    })
    .select("id")
    .single();
  if (eventErr) throw eventErr;

  const { data: listingRow, error: listingErr } = await supabase
    .from("surplus_listings")
    .insert({
      food_type: "Paneer Butter Masala & Roti",
      quantity: 120,
      pickup_location: "Mumbai Main Center",
      pickup_deadline: "19:00 - 21:00",
      status: "available",
      event_id: eventRow.id,
      created_by: orgProfile.id,
    })
    .select("id, status, created_by")
    .single();
  if (listingErr) throw listingErr;
  console.log("PASS: surplus_listing created with created_by (int8):", listingRow.created_by, "Listing ID:", listingRow.id);

  console.log("\n=== STEP 3: NGO signup (trigger creates profile) ===");
  const { data: ngoAuth, error: ngoAuthErr } = await supabase.auth.signUp({
    email: ngoEmail,
    password,
    options: {
      data: {
        full_name: `NGO Test ${ts}`,
        role: "ngo",
        ngo_name: `Sustain NGO ${ts}`,
        contact_phone: "+919988776655",
        city: "Mumbai",
      },
    },
  });
  if (ngoAuthErr) throw ngoAuthErr;
  if (!ngoAuth.user?.id) throw new Error("NGO auth user missing");

  if (ngoAuth.session) await supabase.auth.setSession(ngoAuth.session);

  const { userRow: ngoUser, profileRow: ngoProfile } = await waitForProfile(
    ngoAuth.user.id,
    "ngo"
  );
  console.log("PASS: users row created:", ngoUser.id, ngoUser.role);
  console.log("PASS: ngos row created:", ngoProfile.id, ngoProfile.ngo_name);

  console.log("\n=== STEP 4: See listing in feed ===");
  const { data: feed, error: feedErr } = await supabase
    .from("surplus_listings")
    .select("id, status")
    .eq("status", "available")
    .eq("id", listingRow.id);
  if (feedErr) throw feedErr;
  if (!feed?.length) throw new Error("Listing not visible in feed");
  console.log("PASS: Listing visible in available feed");

  console.log("\n=== STEP 5: Claim listing (NGO Claim Insert + Update status) ===");
  // 1. Insert into claims using ngo_id = ngoProfile.id (int8)
  const { data: claimRow, error: claimErr } = await supabase
    .from("claims")
    .insert({
      listing_id: listingRow.id,
      ngo_id: ngoProfile.id,
      claimed_at: new Date().toISOString(),
      pickup_status: "pending",
      notes: "Test claim",
    })
    .select("id, ngo_id")
    .single();
  if (claimErr) throw claimErr;
  console.log("PASS: claim row inserted with ngo_id (int8):", claimRow.ngo_id);

  // 2. Update surplus_listings setting status = 'claimed' where status = 'available'
  const { data: updated, error: updateErr } = await supabase
    .from("surplus_listings")
    .update({ status: "claimed" })
    .eq("id", listingRow.id)
    .eq("status", "available")
    .select("id, status");
  if (updateErr) throw updateErr;
  if (!updated?.length) throw new Error("Claim update failed - listing was no longer available");
  console.log("PASS: surplus_listings status updated to 'claimed'");

  console.log("\n=== STEP 6: Confirm listing disappears from feed ===");
  const { data: newFeed } = await supabase
    .from("surplus_listings")
    .select("id")
    .eq("status", "available")
    .eq("id", listingRow.id);
  if (newFeed && newFeed.length > 0) throw new Error("Listing still appears in available feed!");
  console.log("PASS: Listing successfully disappeared from available feed");

  console.log("\n=== ALL STEPS PASSED SUCCESSFULLY ===");
}

runTest().catch((err) => {
  console.error("\n=== TEST FAILED ===");
  console.error(err.message || err);
  process.exit(1);
});
