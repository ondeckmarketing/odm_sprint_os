export async function onRequestPost({ env, request }) {
  const { id, owner, by } = await request.json();
  if (!id) return new Response("missing id", { status: 400 });
  const at = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO task_state (id, done, owner, updated_at, updated_by)
     VALUES (?1, 0, ?2, ?3, ?4)
     ON CONFLICT(id) DO UPDATE SET owner=?2, updated_at=?3, updated_by=?4`
  ).bind(id, owner == null ? "" : owner, at, by || "").run();
  return Response.json({ ok: true });
}
