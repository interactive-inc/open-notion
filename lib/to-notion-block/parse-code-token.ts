import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { parseInlineToken } from "@/to-notion-block/parse-inline-token"
import { BlockType } from "@/types"

type LanguageRequest =
  | "abc"
  | "abap"
  | "agda"
  | "arduino"
  | "ascii art"
  | "assembly"
  | "bash"
  | "basic"
  | "bnf"
  | "c"
  | "c#"
  | "c++"
  | "clojure"
  | "coffeescript"
  | "coq"
  | "css"
  | "dart"
  | "dhall"
  | "diff"
  | "docker"
  | "ebnf"
  | "elixir"
  | "elm"
  | "erlang"
  | "f#"
  | "flow"
  | "fortran"
  | "gherkin"
  | "glsl"
  | "go"
  | "graphql"
  | "groovy"
  | "haskell"
  | "hcl"
  | "html"
  | "idris"
  | "java"
  | "javascript"
  | "json"
  | "julia"
  | "kotlin"
  | "latex"
  | "less"
  | "lisp"
  | "livescript"
  | "llvm ir"
  | "lua"
  | "makefile"
  | "markdown"
  | "markup"
  | "matlab"
  | "mathematica"
  | "mermaid"
  | "nix"
  | "notion formula"
  | "objective-c"
  | "ocaml"
  | "pascal"
  | "perl"
  | "php"
  | "plain text"
  | "powershell"
  | "prolog"
  | "protobuf"
  | "purescript"
  | "python"
  | "r"
  | "racket"
  | "reason"
  | "ruby"
  | "rust"
  | "sass"
  | "scala"
  | "scheme"
  | "scss"
  | "shell"
  | "smalltalk"
  | "solidity"
  | "sql"
  | "swift"
  | "toml"
  | "typescript"
  | "vb.net"
  | "verilog"
  | "vhdl"
  | "visual basic"
  | "webassembly"
  | "xml"
  | "yaml"
  | "java/c/c++/c#"

/**
 * Map token language to Notion supported language
 */
function mapLanguage(lang: string | undefined): LanguageRequest {
  if (!lang) return "plain text"

  // Notion supported languages
  const supportedLanguages: LanguageRequest[] = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "c++",
    "c#",
    "go",
    "rust",
    "php",
    "ruby",
    "swift",
    "kotlin",
    "scala",
    "r",
    "html",
    "css",
    "scss",
    "sass",
    "less",
    "json",
    "xml",
    "yaml",
    "markdown",
    "sql",
    "shell",
    "bash",
    "powershell",
    "docker",
    "makefile",
    "latex",
    "matlab",
    "mathematica",
    "lua",
    "perl",
    "haskell",
    "clojure",
    "erlang",
    "elixir",
    "elm",
    "f#",
    "ocaml",
    "reason",
    "purescript",
    "coffeescript",
    "livescript",
    "dart",
    "julia",
    "groovy",
    "objective-c",
    "assembly",
    "fortran",
    "coq",
    "agda",
    "prolog",
    "scheme",
    "racket",
    "lisp",
    "smalltalk",
    "verilog",
    "vhdl",
    "solidity",
    "graphql",
    "protobuf",
    "toml",
    "nix",
    "dhall",
    "bnf",
    "ebnf",
    "gherkin",
    "diff",
    "glsl",
    "webassembly",
    "mermaid",
    "ascii art",
    "basic",
    "pascal",
    "visual basic",
    "vb.net",
    "abap",
    "abc",
    "arduino",
    "hcl",
    "llvm ir",
    "markup",
    "notion formula",
    "plain text",
  ]

  const lowerLang = lang.toLowerCase() as LanguageRequest
  return supportedLanguages.includes(lowerLang) ? lowerLang : "plain text"
}

/**
 * Convert code token to Notion block
 */
export function parseCodeToken(token: Tokens.Code): BlockObjectRequest {
  return {
    type: BlockType.Code,
    code: {
      rich_text: [parseInlineToken(token)],
      language: mapLanguage(token.lang),
    },
  } as const
}
