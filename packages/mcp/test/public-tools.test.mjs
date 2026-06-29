import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { test } from "node:test";

function parseMessages(buffer) {
  return buffer
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function send(child, message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

test("public MCP tools are search, pull, and list installed", async () => {
  const child = spawn("node", ["dist/bundle.js"], {
    cwd: new URL("..", import.meta.url),
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdout = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });

  send(child, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "woven-sfx-test", version: "0.0.0" },
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 150));
  send(child, { jsonrpc: "2.0", method: "notifications/initialized", params: {} });
  send(child, { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  send(child, {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "sfx_search",
      arguments: { query: "whoosh", limit: 1 },
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 500));
  child.kill("SIGTERM");

  const listResponse = parseMessages(stdout).find((message) => message.id === 2);
  const names = listResponse.result.tools.map((tool) => tool.name);
  assert.deepEqual(names, ["sfx_search", "sfx_pull", "sfx_list_installed"]);

  const search = listResponse.result.tools.find((tool) => tool.name === "sfx_search");
  assert.equal(search.inputSchema.properties.transition, undefined);
  assert.ok(search.description.includes("Search"));
  assert.ok(search.description.includes("sound"));

  const searchResponse = parseMessages(stdout).find((message) => message.id === 3);
  const results = JSON.parse(searchResponse.result.content[0].text);
  assert.ok(results.length > 0);
  assert.equal(results[0].pairings, undefined);
});
