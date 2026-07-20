// Unit tests for the Obsidian -> plain markdown transform. Each test feeds a
// small snippet through toMarkdown with a fixed set of existing note ids and
// asserts on the exact output, so regressions in the regexes are caught early.
import { describe, expect, it } from "vitest";
import { toMarkdown } from "./markdown";

const ids = new Set(["some-note", "other-note"]);

describe("toMarkdown", () => {
  it("converts a bare wikilink to an internal note link", () => {
    expect(toMarkdown("see [[some-note]] for more", ids)).toBe(
      "see [some-note](/notes/some-note) for more"
    );
  });

  it("normalises the target to a note id but keeps the original text", () => {
    // "Some Note" -> id "some-note" (trim, lowercase, spaces -> dashes)
    expect(toMarkdown("[[Some Note]]", ids)).toBe("[Some Note](/notes/some-note)");
  });

  it("uses the alias as link text for [[target|alias]]", () => {
    expect(toMarkdown("[[some-note|a nicer label]]", ids)).toBe(
      "[a nicer label](/notes/some-note)"
    );
  });

  it("marks wikilinks to missing notes as (unresolved)", () => {
    expect(toMarkdown("[[ghost-note]]", ids)).toBe("[ghost-note](unresolved)");
  });

  it("leaves wikilinks and tags inside inline code untouched", () => {
    expect(toMarkdown("use `[[some-note]]` and `#ai` literally", ids)).toBe(
      "use `[[some-note]]` and `#ai` literally"
    );
  });

  it("leaves fenced code blocks untouched, while prose around them transforms", () => {
    const input = "[[some-note]]\n\n```md\n[[some-note]] #ai/agents\n```\n\n#ai";
    expect(toMarkdown(input, ids)).toBe(
      "[some-note](/notes/some-note)\n\n```md\n[[some-note]] #ai/agents\n```\n\n[#ai](/tags/ai)"
    );
  });

  it("turns #namespace/tag into a link to the slugged tag page", () => {
    expect(toMarkdown("tagged #ai/agents here", ids)).toBe(
      "tagged [#ai/agents](/tags/ai-agents) here"
    );
  });

  it("does not treat headings or mid-word hashes as tags", () => {
    // "# Heading" (hash + space) and "foo#bar" (hash after a word char) stay as-is
    expect(toMarkdown("# Heading\n\nfoo#bar", ids)).toBe("# Heading\n\nfoo#bar");
  });

  it("makes relative image paths absolute but leaves remote urls alone", () => {
    expect(toMarkdown("![a](assets/pic.svg) ![b](https://x.test/p.png)", ids)).toBe(
      "![a](/assets/pic.svg) ![b](https://x.test/p.png)"
    );
  });
});
