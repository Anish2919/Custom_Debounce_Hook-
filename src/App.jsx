import { useEffect, useState } from 'react'
import './App.css'
import TextField from './components/TextField'
import { useDebounce } from './hooks/useDebounce';
import { getCharacter } from './helpers/utils';
import { ChakraProvider, Box, Text, Heading } from '@chakra-ui/react';

function App() {
  const [query, setQuery] = useState(''); 
  const [listing, setListing] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const searchQuery = useDebounce(query, 2000); 

  useEffect(() => {
    setListing(''); 
    if(searchQuery || query.length < 0) searchCharacter(); 
   
    async function searchCharacter() {
      console.log('fuck you'); 
      setListing(''); 
      setLoading(true); 
      try{
        const data = await getCharacter(searchQuery); 
        setListining(data.results); 
        setLoading(false); 
      } catch(err) {
        setLoading(false); 
      }
    }
  }, [searchQuery]); 
  return (
    <>
      <ChakraProvider>
        <Heading mb={4}>Search Rick and Morty Character</Heading>
        <Text fontSize='md' textAlign="left" mb={10}>
          With a debouce hook implemented
        </Text>
        <TextField mb={10} onChange={(event) => {
          setQuery(event.target.value); }} value={query} />
        {loading && <Text mb={10} mt={10} textAlign="left">Loading...</Text>}
        {listing && <Box mt={10} display={'block'}>{listing.map(character => (
          <Box key={character.id} mb={10}>
            <img src={character.image} alt={character.name} />
            {character.name}
          </Box>
        ))}</Box>}
      </ChakraProvider>
    </>
  )
}

export default App
