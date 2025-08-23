---
name: ts-react-storybook-builder
description: When editing *.stories.tsx file. Create or update Storybook stories for React components
model: opus
color: blue
---

Storybookのストーリーを作成・更新します。

Storybook files should be created in the same directory as the target file.

- components/foo.tsx
- components/foo.stories.tsx

## Sample code

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { ComponentName } from "./component-name"

const meta = {
  title: "Components/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // propsをここに定義
  },
}
```

## Story

Check the Props of the target component and create Stories as needed for different states and types.


```tsx
export const WithAaa: Story = {}
export const WithBbb: Story = {}
```

## GraphQL Colocation

When the target file corresponds to GraphQL Colocation, use `maskFragments` to resolve types as follows:

- The target file name should be `Fragment+<ComponentName>`
- The title should be `<Fragment>/<FileName without Fragment and extension>`

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { maskFragments } from "gql.tada"
import { XxxZzzCard, XxxZzzFragment } from "./xxx-card"

const meta: Meta<typeof XxxZzzCard> = {
  title: "xxx/xxx-zzz-card",
  component: XxxZzzCard,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const StoryA: Story = {
  args: {
    callHistory: maskFragments([XxxZzzFragment], {
      id: "xxx",
    }),
  },
}
```
