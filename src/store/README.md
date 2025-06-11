### 基本使用

### 简介

    Recoil 是facebook创建的状态管理库。

#### 初始化

使用  `recoil`  状态的组件需要使用  `RecoilRoot`  包裹起来：

```
import React from 'react';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

function App() {
    return ( <RecoilRoot> <App /> </RecoilRoot> );
}
```

#### 定义状态

`Atom`  是一种新的状态，但是和传统的  `state`  不同，它可以被任何组件订阅，当一个  `Atom`  被更新时，每个被订阅的组件都会用新的值来重新渲染。

首先我们来定义一个  `Atom`：

```
export const nameState = atom({
 key: 'nameState',
 default: 'Joy'
});
```

这种方式意味着你不需要像 `Redux` 那样集中定义状态，可以像 `Mobx` 一样将数据分散定义在任何地方。

要创建一个 `Atom` ，必须要提供一个 `key` ，其必须在 `RecoilRoot` 作用域中是唯一的，并且要提供一个默认值，默认值可以是一个静态值、函数甚至可以是一个异步函数。

#### 订阅和更新状态

`Recoil` 采用 `Hooks` 方式订阅和更新状态，常用的是下面三个 API：

- `useRecoilState`：类似 useState 的一个 `Hook`，可以取到 `atom` 的值以及 `setter` 函数
- `useSetRecoilState`：只获取 `setter` 函数，如果只使用了这个函数，状态变化不会导致组件重新渲染
- `useRecoilValue`：只获取状态

```
import { nameState } from './store'
// useRecoilState
const NameInput = () => {
  const [name, setName] = useRecoilState(nameState);
  const onChange = (event) => {
   setName(event.target.value);
  };
  return <>
   <input type="text" value={name} onChange={onChange} />
   <div>Name: {name}</div>
  </>;
}

// useRecoilValue
const SomeOtherComponentWithName = () => {
  const name = useRecoilValue(nameState);
  return <div>{name}</div>;
}

// useSetRecoilState
const SomeOtherComponentThatSetsName = () => {
  const setName = useSetRecoilState(nameState);
  return <button onClick={() => setName('Jon Doe')}>Set Name</button>;
}
```

#### 派生状态

`selector`  表示一段派生状态，它使我们能够建立依赖于其他  `atom`  的状态。它有一个强制性的  `get`  函数。

```
const lengthState = selector({
  key: 'lengthState',
  get: ({get}) => {
    const text = get(nameState);
    return text.length;
  },
});

function NameLength() {
  const length = useRecoilValue(charLengthState);
  return <>Name Length: {length}</>;
}
```

selector 是一个纯函数：对于给定的一组输入，它们应始终产生相同的结果（至少在应用程序的生命周期内）。这一点很重要，因为选择器可能会执行一次或多次，可能会重新启动并可能会被缓存。

#### 异步状态

`Recoil` 提供了通过数据流图将状态和派生状态映射到 `React` 组件的方法。这使得我们可以在异步 `React` 组件渲染函数中轻松使用异步函数。使用 `Recoil` ，你可以在选择器的数据流图中无缝地混合同步和异步功能。只需从选择器 `get` 回调中返回 `Promise` ，而不是返回值本身。

```
const userNameQuery = selector({
 key: 'userName',
 get: async ({get}) => {
   const response = await API({
     userID: get(currentUserIDState),
   });
   return response.name;
 },
});

function CurrentUserInfo() {
 const userName = useRecoilValue(userNameQuery);
 return <div>{userName}</div>;
}
```

this project is created by JoyZhou (huan.zhou@zeiss.com), if you have any questions about it, please contact me.
