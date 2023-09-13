# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# What is debouncing?
Debouncing is an optimizing technique for the result of any expensive function. These functions can take a lot of execution effort, so we will create this effect by simulating a delayed execution for a period. Using debounce can improve our React application by chunking the executed actions, adding a delayed response, and executing the last call.

There are a lot of built-in Hooks in React, including use, useState, useEffect, useMemo, useContext, to name a few. We can even combine multiple Hooks and create custom Hooks for our React application. Custom React Hooks are functions that start with use keywords followed by the name of the Hook we are making.

Before creating a debounce Hook, we need to understand the following:

Hooks are not called inside a loop, conditions, or nested functions
Multiple Hooks can be used to build new ones
Hooks can only be called from React functions
Hooks are made for functional components.
Name Hooks starting with the word “use”
We are building an application that will simulate excessive API calls to the backend sent by pressing keystrokes. To reduce the excessive calls, we will introduce the useDebounce React Hook. This Hook will consume the value and the timer we passed.

We will only execute the most recent user action if the action is continuously invoked. Using the debounce React Hook will reduce the unnecessary API calls to our server and optimize our application for better performance.


# Creating our React app 
For this application, we will be using a simple React, Vite.js, and JavaScript application. We will add a few sprinkles of styling with Chakra UI.

Let’s create a Vite.js application with this command:

<pre>
<code>```javascript
npm create vite@latest react-useDebounce
cd react-useDebounce
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
```</code>
</pre>

After all the packages have been added, we can start creating the components folder. We will begin with a simple TextField that we will import from Chakra:

<pre>
<code>```javascript
export default function Inputfield({onChange, value}) {
 return (
   <div>
     <Input onChange={onChange} value={value} placeholder='Search your character' size='md' />
   </div>
 )
}
```</code>
</pre>

This component is a simple input that takes in an onChange function and value as a prop. We will use a response from our API to list all the characters we find.

We need to call our endpoint and receive the response from it, so we will create a Utils folder and get data using the browser native fetch API:

<pre>
<code>```javascript
export async function getCharacter(value) {
 const data = await fetch(
   `https://rickandmortyapi.com/api/character/?name=${value}`
 )
 const response = await data.json()
 if (response === undefined || response.error) {
   throw new Error(`HTTP error! status: ${response.error}`);
 }
 return response
}
```</code>
</pre>


Here, we created a function that makes an API call to the server and parses the data to JSON. We also added a basic error handling in case we receive an error or undefined from the server.

# Writing our custom debounce React Hook
Now, we can go ahead and create a Hooks folder where we will add the Hooks we create for our application. You can brush up on the best practices for using React Hooks here.

Inside of useDebounce.jsx, we will write our useDebounce function:

<pre>
<code>```javascript
import { useState, useEffect } from 'react'

export const useDebounce = (value, milliSeconds) => {
 const [debouncedValue, setDebouncedValue] = useState(value);

 useEffect(() => {
   const handler = setTimeout(() => {
     setDebouncedValue(value);
   }, milliSeconds);

   return () => {
     clearTimeout(handler);
   };
 }, [value, milliSeconds]);

 return debouncedValue;
};
```</code>
</pre>

You can see nothing much going on in this function, but don’t worry, we will fix this as we go along. This is nothing new if you are familiar with the setTimeOut and clearTimeOut functions.

The function takes value and milliseconds as a second parameter, extending its execution with a specific time interval. We also cleared the time with a cleanup return call and added the value and milliSeconds as a dependency array. Here’s some more information about the functions:

useState(): This Hook helps us store the needed values
useEffect(): Used to update the debounce value with a cleanup function
setTimeOut(): Creates timeout delays
clearTimeOut: Clean up, dismounting the component relating to user input
We can implement our debounce React Hook inside our application:

<pre>
<code>```javascript
import { useState, useEffect } from 'react'
import { ChakraProvider, Heading, Text, Box } from '@chakra-ui/react'
import Inputfield from './components/input-field'
import { useDebounce } from './hooks/useDebounce'
import { getCharacter } from './utils/getCharacter'
import './App.css'

function App() {
 const [query, setQuery] = useState('')
 const [listing, setListing] = useState('')
 const [loading, setLoading] = useState(false)

 const searchQuery = useDebounce(query, 2000)

 useEffect(() => {
   setListing('')
   if (searchQuery || query.length < 0) searchCharacter();
   async function searchCharacter() {
     setListing('')
     setLoading(true)
     const data = await getCharacter(searchQuery)
     setListing(data.results)
     setLoading(false)
   }
 }, [searchQuery])

 return (
   <div className="App">
     <ChakraProvider>
       <Heading mb={4}>Search Rick and Morty Character</Heading>
       <Text fontSize='md' textAlign="left" mb={10}>
         With a debouce hook implemented
       </Text>
       <Inputfield mb={10} onChange={(event) => setQuery(event.target.value)} value={query} />
       {loading && <Text mb={10} mt={10} textAlign="left">Loading...</Text>}
       {listing && <Box mt={10} display={'block'}>{listing.map(character => (
         <Box key={character.id} mb={10}>
           <img src={character.image} alt={character.name} />
           {character.name}
         </Box>
       ))}</Box>}
     </ChakraProvider>
   </div>
 )
}

export default App
```</code>
</pre>


So far, we’ve done the basic implementation and used useState to store state for our searchQuery word.

After finding the result, we’ll set our listing state with the data. Because this is an asynchronous action, we added loading to continue tracking the data loading state.

Although this is a simple implementation of a debounce Hook, we will improve and refactor our code. Let’s get into improving our code.