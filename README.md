# react-async-component-hoc

> Async HOC for React developers (3kb gzip)

[![NPM](https://img.shields.io/npm/v/react-async-component-hoc.svg)](https://www.npmjs.com/package/react-async-component-hoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This component is designed to make writing components that require complex async calls and
promise resolution obvious and easy to understand. It makes writing async components feel
much more like writing a normal component.

Using this library you can also more easily construct components that render partially as data
becomes available without being tied to any kind of library or magic functions.

It's very easy to get started, but you can also tap into some advanced features with minimum fuss.

## Install

```bash
npm install --save react-async-component-hoc
```

## Usage

```jsx
import React, { Component } from 'react'

import {createAsyncComponent} from 'react-async-component-hoc'

const MyComponent = createAsyncComponent(function MyComponent({address}) {
    const classes = useStyles()
    return async ()=> {
        const response = await fetch(`${FETCH_URL}?address=${address}`)
        const data = await response.json()
        return <div>{data.main}</div>
    }
})

//Renders "null" until the async function returns
<MyComponent address={"my house, my lane, my town"}/>

```

## Examples

4 practical examples can be found in the `example` project. `src/examples`

You can view them running [here](http://bethanycollinge.co.uk/react-async-component-hoc/).

## Basic Principles

The core of the library is the `createAsyncComponent` function which wraps your function and
enables it to return components to be rendered asynchronously. `createAsyncComponent` takes one
or two functions as parameters depending on whether you wish to supply a special template
to render parts of your results.

Your component will only render once unless you pass a refresh function to teach it how to tell
if it has changed. (It will also re-render if remounted or it has a changed key prop).

### The Component function

The last parameter you pass to `createAsyncComponent` will be the one that performs your
async actions. This function can be `async` or it can return an `async` function. The reason
you might want to return an `async` function is because you need to call some hooks before
diving into the async stuff. Several of the examples use this to get styles or themes etc.

```jsx
const XXX = createAsyncComponent(function MyComponent(props) {
    //In the first part you can call hooks

    //Cache values in refs if the fact they have changed would
    //affect the rendering of your components later (not normally
    //necessary)

    const someVariable = useContext(SomeContext)
    const classes = useStyles(props)
    return async () => {
        //Do your async work in here
        return (
            <Your>
                <JSX with={someVariable} className={classes.class} />
            </Your>
        )
    }
})
```

### Using a fallback

By default your component will be null until it is complete. There are two ways to override this:

```jsx

import {AsyncFallback} from 'react-async-component-hoc'

...
    return (
      <AsyncFallback fallback={<CircularProgress/>}>
          <YourAsyncComponent/>
      </AsyncFallback>
   )

```

Using AsyncFallback allows you to specify anything to be rendered until your component is ready.

Alternatively your render function's props have a `resolve` function added which you can call at
any time to change what your component is rendering.

```jsx
const XXX = createAsyncComponent(function MyNewComponent({ resolve, url }) {
    return async () => {
        resolve(<h5>Running....</h5>)
        const result = await fetch(url)
        resolve(<h5>Fetched....</h5>)
        const data = await result.json()
        return (
            <div>
                {data.items.map((item) => (
                    <div key={item.id}>{item.data}</div>
                ))}
            </div>
        )
    }
})
```

### Using the built in template

If you only pass one function to createAsyncComponent it uses the built in BoxTemplate which allows
you to write a component that just returns a set of React elements which it will then render as shown
above. It also allows you to render multiple parts of a result if you calculate incremental values.

The built in template has a series of JSX components it renders. Each of these has a key. It renders
the keys in order. If you just return it overwrites the one component being rendered which has a key of 0.

```jsx
const ExampleComponent3 = createAsyncComponent(async function MyComponent({ resolve }) {
    const order = [10, 7, 4, 1, 2, 8, 6, 9, 3, 5]
    for (let i = 0; i < 10; i++) {
        let item = order[i]
        resolve(
            item,
            <Box p={1}>
                I am item index {item} - rendered in sequence {i + 1}
            </Box>
        )

        if (i < 9) {
            resolve(
                order[i + 1],
                <Box ml={1}>
                    <CircularProgress color={'secondary'} size={20} />
                </Box>
            )
        }
        await new Promise((resolve) => setTimeout(resolve, 1500))
    }
})
```

This component renders the items out of order, and renders a progress circle for the next one. You use
the resolve function, this time passing a key. As mentioned before keys are rendered in sorted order, not in
the order you call the resolve function - this enables out of order rendering.

Keys start at 0 - this will always have the fallback or null. You can overwrite it at any time.

### Using your own template

You can supply your own template which can use any method it likes to render parts of your
UI. It is passed the keyed object provided by resolve - however in your own templates you
will probably want to use named keys to make it obvious. The resolved elements are passed in `$parts`

You can also take advantage of the `Slot` component which provides an easy way to render a
placeholder while your component loads. Slot takes a Skeleton parameter which is the component
to render which defaults to a grey div with a height passed through from Slot. Material UI Lab Skeleton
component is an excellent, more attractive, plug in for Skeleton in Slot and you can configure it in the normal
way - or use whatever your like.

```jsx
  import Skeleton from '@material-ui/lab/Skeleton'
  import { createAsyncComponent, Slot } from 'react-async-component-hoc'

  ...

  const ExampleComponent4 = createAsyncComponent(

    //******************************************
    // Define a template for the results
    //******************************************

    function Template({ $parts }) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Card variant={"outlined"}>
                        <CardHeader title={'Weather'} subheader={"Will be rendered as soon as possible, before the location search"}/>
                        <CardContent>
                            <Slot fill={$parts.weather} height={150}/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant={"outlined"}>
                        <CardHeader title={'Where shall we go?'} subheader={"Searches for restaurants if the temperature is < 16C, otherwise parks"}/>
                        <CardContent>
                            {/* Use material ui lab Skeleton */}
                            <Slot fill={$parts.location} Skeleton={Skeleton} animation="wave" variant="rect" height={600}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    },

    //******************************************
    // Do the Async processing and fill out the
    // template.
    //******************************************

    function MyComponent({ resolve, lat, lon }) {
        const classes = useStyles()
        return async () => {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
            )
        const data = await response.json()

        //******************************************
        // Populate the weather part of the template
        //******************************************

        resolve(
                'weather',
                <List>
                    <ListItem>
                        <ListItemText
                            primary={data.current.weather[0].main}
                            secondary={data.timezone}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar className={classes.icon}>
                                <FaThermometerFull />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${data.current.temp} C`}
                            secondary={'Temperature'}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar className={classes.icon}>
                                <GiWaterDrop />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${data.current.humidity}%`}
                            secondary={'Humidity'}
                        />
                    </ListItem>
                </List>
            )
       ...
```

### Refreshing

By default the wrapped component will NOT refresh if its props change. You might
want to refresh it! You can do this by passing a refresh function to your component.

```jsx
    const YourComponent = createAsyncComponent(function MyComponent() {
       ...
    }).refreshFn(({url})=>url) //Refresh if url prop changes

```

You could just return all of props, but probably better to limit it to things that matter.

If during your async code you want to restart the whole process you can call the `restart()` function
passed in the props.

```jsx
const ExampleComponent2 = createAsyncComponent(async function MyComponent({ resolve, restart }) {
    resolve(<h4>Ready</h4>)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    for (let i = 0; i < 101; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        resolve(
            <div style={{ width: '100%', background: '#888' }}>
                <div
                    style={{
                        width: `${i * 1}%`,
                        background: '#9f54da',
                        padding: 16,
                    }}
                >
                    {i}
                </div>
                {/* Restart when clicking */}
                <div onClick={() => restart()} style={{ cursor: 'pointer', padding: 7, color: 'white' }}>
                    Click to restart
                </div>
            </div>
        )
    }
    return <h4>Done</h4>
})
```

### Caching

If you would like to cache the component between multiple renders so that it continues
to render it's previous contents until such a time as it has recalculated then you can do
this by passing a function to `keyFn()` that works in a similar way to the refresh.

This significantly improves the user experience in many cases.

```jsx
    const YourComponent = createAsyncComponent(function ComponentNameIsUsedInCacheKey({ url }) {
       ...
    }).keyFn(({url})=>url) //cache for this url and ComponentNameIsUsedInCacheKey

```

The name of the function and the key are combined to create a cache that survives unmount
etc. By default it uses a last 100 LRU function.

## Key components/calls

-   AsyncFallback - provide a fallback for components not yet finished
-   Slot - provide a template slot that can be filled as component render
-   createAsyncComponent - called to create your wrapped component
    -   props.resolve(key, part) OR props.resolve(part) - render components in progress
    -   props.restart() - restart rendering
-   YourComponent = createAsyncComponent(Component)
    -   keyFn(yourFn) - used to provide a caching function for your component
    -   refreshFn(yourFn) - used to provide a way of calculating when a refresh should occur
-   initializeCache(size) - initializes the LRU cache to be a particular size (default 100)

## License

MIT © [miketalbot](https://github.com/miketalbot)
