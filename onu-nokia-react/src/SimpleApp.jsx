import { useState } from 'react';
import { Container, Grid, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { Router as RouterIcon } from '@mui/icons-material';
import PosicaoCliente from './components/PosicaoCliente';

function SimpleApp() {
  const [posicaoData, setPosicaoData] = useState({
    inputSlot: '',
    inputGpon: '',
    inputIndex: ''
  });

  const handlePosicaoChange = (newPosicao) => {
    setPosicaoData(newPosicao);
  };

  return (
    <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <RouterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Gerenciador ONU Nokia - Teste
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <PosicaoCliente onPosicaoChange={handlePosicaoChange} />
      </Container>
    </Box>
  );
}

export default SimpleApp;