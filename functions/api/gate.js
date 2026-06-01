export async function onRequestPost({ env, request }) {
  const { id, val, by } = await request.json();
  if (!id) return new Response("missing id", { status: 400 });
  if (!val) {
    await env.DB.prepare("DELETE FROM gate_state WHERE id = ?1").bind(id).run();
    return Response.json({ ok: true });
  }
  const at = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO gate_state (id, val, updated_at, updated_by)
     VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT(id) DO UPDATE SET val=?2, updated_at=?3, updated_by=?4`
  ).bind(id, val, at, by || "").run();
  return Response.json({ ok: true });
}
