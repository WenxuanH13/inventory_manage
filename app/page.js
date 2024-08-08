'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import { firestore } from '../firebase'
import { Box, Modal, Typography, Stack, TextField, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { collection, getDocs, deleteDoc, doc, query, getDoc, setDoc, updateDoc } from 'firebase/firestore'


const OutlinedTypography = styled(Typography)(({ theme }) => ({
  color: 'transparent',
  WebkitTextStroke: '2px black',
  textStroke: '2px white',
  // Fallback for browsers that don't support text-stroke
  textShadow: `
    -1px -1px 0 white,  
    1px -1px 0 white,
    -1px 1px 0 white,
    1px 1px 0 white
  `,
}));

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs  = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        name: doc.id,
        quantity: doc.data().quantity,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
    
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }else{
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])
  
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <Box 
    width = '100vw'
    bgcolor = 'peachpuff' 
    height = '100vh' 
    display="flex" 
    flexDirection="column"
    alignItems="center" 
    justifyContent="center" 
    gap={2}>
      <OutlinedTypography variant="h1" color="white" sx={{ fontSize: '60px', fontWeight: 'bold' }}>Inventory Manager</OutlinedTypography>
      <Modal open = {open} onClose = {handleClose}>
        <Box
        position = "absolute"
        top="50%"
        left="50%"
        sx={{transform: "translate(-50%, -50%)"}}
        width={400}
        bgcolor="white"
        border="2px solid #000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
            variant='outlined'
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }}></TextField>
            <Button variant="outlined" onClick={()=>{
            addItem(itemName)
            setItemName('')
            handleClose()
            }}>Add Item</Button>
          </Stack>
        </Box>
      </Modal>
      <TextField
        variant="outlined"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ width: '800px', 
          marginBottom: 2,
          bgcolor: 'white',  
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#1976D2',  
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0D47A1',  
            },
          },
        }}
      />
      
      <Button variant="contained" 
      sx={{
        fontSize: '1.2rem',
        padding: '12px 24px',
        marginBottom: '20px',
        fontWeight: 'bold',
        textTransform: 'none',
      }}
      onClick={() => {
        handleOpen()
      }}>Add New Item</Button>
      
      
      
      <Box border="1px solid #333">
        <Box 
        width="800px"
        height="100px"
        bgcolor="#D0F0C0"
        display="flex"
        alignItems="center"
        justifyContent="center">
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
      
        <Stack width = "800px" height="300px" spacing={2} overflow="auto" sx={{ bgcolor: '#e0e0e0' }}>
          {filteredInventory.map(({name, quantity}) => (
              <Box 
              key={name} 
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
              sx={{
                minWidth: '100%',
                overflowX: 'auto',
                '& > *': { flexShrink: 0 }
              }}
              >
                <Typography variant="h3" color="#333" textAlign="center" sx={{ marginRight: 3 }}>{name}</Typography>
                <Typography variant="h3" color="violet" textAlign="center" sx={{ marginRight: 3 }}>{quantity}</Typography>
                <Stack direction="row" spacing={2} >
                <Button variant= "contained" onClick={() => {
                  addItem(name)
                }}>Add Item</Button>
                <Button variant= "contained" onClick={() => {
                  removeItem(name)
                }}>Remove Item</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
      </Box>
    </Box>
  )
}