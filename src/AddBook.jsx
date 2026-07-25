import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const emptyBook = {
  author: '',
  isbn: '',
  price: '',
  title: '',
  year: ''
};

function AddBook({ onAddBook }) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState(emptyBook);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    onAddBook(book);
    setBook(emptyBook);
    handleClose();
  };

  const inputChanged = (event) => {
    const { name, value } = event.target;

    setBook((currentBook) => ({
      ...currentBook,
      [name]: value
    }));
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Add book
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New book</DialogTitle>

        <DialogContent>
          <TextField
            name="author"
            value={book.author}
            onChange={inputChanged}
            margin="dense"
            label="Author"
            fullWidth
          />

          <TextField
            name="isbn"
            value={book.isbn}
            onChange={inputChanged}
            margin="dense"
            label="ISBN"
            fullWidth
          />

          <TextField
            name="price"
            value={book.price}
            onChange={inputChanged}
            margin="dense"
            label="Price"
            type="number"
            fullWidth
          />

          <TextField
            name="title"
            value={book.title}
            onChange={inputChanged}
            margin="dense"
            label="Title"
            fullWidth
          />

          <TextField
            name="year"
            value={book.year}
            onChange={inputChanged}
            margin="dense"
            label="Year"
            type="number"
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddBook;