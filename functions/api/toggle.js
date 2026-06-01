export async function onRequestPost({ env, request }) {
  const { id, done, by } = await request.json();
  if (!id) return new Response("missing id", { status: 400 });
  const at = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO task_state (id, done, updated_at, updated_by)
     VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT(id) DO UPDATE SET done=?2, updated_at=?3, updated_by=?4`
  ).bind(id, done ? 1 : 0, at, by || "").run();
  return Response.json({ ok: true });
}
