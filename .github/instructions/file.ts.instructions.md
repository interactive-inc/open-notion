---
applyTo: '**/*.ts'
---

# File rules - TypeScript

- Use descriptive naming conventions
- No type assertion using "as"
- Use "type" instead of "interface"
- Use for-of loops instead of forEach
- Do NOT use destructuring
- Avoid if-else statements
- Use early returns instead of nested if statements
- Do NOT abbreviate variable names
- When multiple arguments are needed, use an object named "props" with a defined "Props" type
- Use const whenever possible, avoid let and var
- Do NOT use delete operator
- Do NOT use enum
- Use variable name "props" for function arguments
- Avoid any type

## Functions

- Prefer pure functions
- Use immutable data structures
- Isolate side effects
- Ensure type safety

## Classes

- Do NOT define classes with only static members
- Avoid class inheritance
- Make classes immutable

## Comments

- Add comments only when function behavior is not easily predictable
- Do NOT use param or return annotations

## React

- Use TailwindCSS
- Use shadcn/ui
- Write components in the format: export function ComponentName () {}
