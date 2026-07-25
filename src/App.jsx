import { useCallback, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry
} from 'ag-grid-community';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import AddBook from './AddBook';
import './App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const FIREBASE_URL =
  'https://bookstore-87bfa-default-rtdb.europe-west1.firebasedatabase.app/books';

function App() {
  const [books, setBooks] = useState([]);

  const fetchItems = useCallback(() => {
    fetch(`${FIREBASE_URL}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load books: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        const booksWithIds = data
          ? Object.entries(data).map(([id, book]) => ({
              ...book,
              id
            }))
          : [];

        setBooks(booksWithIds);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addBook = useCallback(
    (newBook) => {
      fetch(`${FIREBASE_URL}.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Could not add book: ${response.status}`);
          }

          return response.json();
        })
        .then(() => {
          fetchItems();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [fetchItems]
  );

  const deleteBook = useCallback(
    (id) => {
      fetch(`${FIREBASE_URL}/${id}.json`, {
        method: 'DELETE'
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Could not delete book: ${response.status}`);
          }

          fetchItems();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [fetchItems]
  );

  const colDefs = useMemo(
    () => [
      {
        field: 'author',
        width: 199,
        sortable: true,
        filter: true
      },
      {
        field: 'isbn',
        headerName: 'ISBN',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        field: 'price',
        width: 85,
        sortable: true,
        filter: true
      },
      {
        field: 'title',
        width: 200,
        sortable: true,
        filter: true
      },
      {
        field: 'year',
        width: 85,
        sortable: true,
        filter: true
      },
      {
        headerName: '',
        field: 'id',
        width: 80,
        sortable: false,
        filter: false,
        cellRenderer: (params) => (
          <IconButton
            onClick={() => deleteBook(params.data.id)}
            size="small"
            color="error"
            aria-label={`Delete ${params.data.title}`}
          >
            <DeleteIcon />
          </IconButton>
        )
      }
    ],
    [deleteBook]
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>

      <AddBook onAddBook={addBook} />

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