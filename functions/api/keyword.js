export async function onRequestPost({ env, request }) {
  const b = await request.json();
  const { op, id } = b;
  if (!id) return new Response("missing id", { status: 400 });
  if (op === "delete") {
    await env.DB.prepare("DELETE FROM keyword_state WHERE id = ?1").bind(id).run();
    return Response.json({ ok: true });
  }
  const at = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO keyword_state (id, client, kw, note, primary_flag, updated_at, updated_by)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     ON CONFLICT(id) DO UPDATE SET kw=?3, note=?4, primary_flag=?5, updated_at=?6, updated_by=?7`
  ).bind(id, b.client || "", b.kw || "", b.note || "", b.primary ? 1 : 0, at, b.by || "").run();
  return Response.json({ ok: true });
}
