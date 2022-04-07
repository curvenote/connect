# curvenote/connect

Communicate with webpages in iframes that want to receive Jupyter notebook outputs

## In a host page

Include an `iframe` with the following attributes (examples here use React):

```tsx
<iframe
  id={uid}
  name={uid}
  title={title}
  src={url}
  height={height ?? 150}
  sandbox="allow-scripts"
/>
```

The `uid` should be unqiue for each `iframe`, as there are potentially many on the host page.

It should also add the `host.reducer` as a slcice within it's Redux store:

```typescript
import { host } from '@curvenote/connect';

const store = createStore(
  combineReducers({
    // other application reducers
    host: host.reducer,
  }),
  applyMiddleware(thunkMiddleware),
);
```

and register a message listener, connected to the store:

```typescript
host.registerMessageListener(store);
```

Communication actions can then be dispatched to the `iframe` using the `host.commsDispatch`
function.

```typescript
import { host, actions } from '@curvenote/connect';

...

host.commsDispatch(
  iframeRef.current,
  actions.connectHostSendContent(uid, data)
);
```

## In the `iframe` page

Similarly the `iframe.reducer` should be added to the Redux store for the page

```typescript
import { iframe } from '@curvenote/connect';

const store = createStore(iframe.reducer, applyMiddleware(thunkMiddleware));
```

And two listener/observer functions are registered:

```typescript
iframe.registerMessageListener(
  {
    origin: 'http://localhost:3000',
  },
  store,
  jsonRenderer,
);

iframe.registerResizeObserver(store, document);
```
