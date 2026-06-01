export async function onRequestPost({ env }) {
  // Clears task completion and all gate scores for a fresh sprint.
  // Owner assignments are intentionally preserved.
  await env.DB.prepare("UPDATE task_state SET done = 0").run();
  await env.DB.prepare("DELETE FROM gate_state").run();
  return Response.json({ ok: true });
}
