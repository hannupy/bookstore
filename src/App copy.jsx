import { useState, useEffect, useCallback  } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';
import './App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [books, setBooks] = useState([]);
  // for initial fetch
  useEffect(() => {
    fetchItems();
  }, []);

  const [colDefs] = useState([
    { field: 'author', width: 199, sortable: true, filter: true },
    { field: 'isbn',   width: 150, sortable: true, filter: true, headerName: 'ISBN' },
    { field: 'price',  width: 85,  sortable: true, filter: true },
    { field: 'title',  width: 200, sortable: true, filter: true },
    { field: 'year',   width: 85,  sortable: true, filter: true },
    { 
      headerName: '',
      field: 'id',
      width: 80,
      cellRenderer: params => 
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]);

  const addBook = (newTodo) => {
    fetch('https://bookstore-87bfa-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newTodo)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }
    const fetchItems = useCallback(() => {
    fetch('https://bookstore-87bfa-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
    .then(response => response.json())
    .then(data => addKeys(data)) 
    .catch(err => console.error(err))
  });
  const addKeys = (data) => {
    // handle empty data
    if(!data){
      setBooks([]);
      return;
    }
    // making thing little bit easier, making things possibly faster on page load
    const valueKeys = Object.entries(data).map(([id, book]) => ({
      ...book,
      id
    }));
    setBooks(valueKeys);
  }

  const deleteBook = (id) => {
  fetch(`https://bookstore-87bfa-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
  {
    method: 'DELETE',
  })
  .then(response => fetchItems())
  .catch(err => console.error(err))
  } 

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddBook AddBook={addBook} align='left' />  
      <div style={{ height: 500, width: 800 }}> 
        <AgGridReact 
          rowData={books}
          columnDefs={colDefs}
        />
      </div>
      </>
  );
}

export default App;