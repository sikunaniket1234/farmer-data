import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';

const LocationInsert = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [newState, setNewState] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newBlock, setNewBlock] = useState('');
  const [newPanchayat, setNewPanchayat] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importErrors, setImportErrors] = useState([]);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/location/states', { withCredentials: true });
        setStates(res.data);
      } catch (err) {
        setError('Failed to fetch states: ' + (err.response?.data?.message || err.message) + '. Ensure the /api/location/states endpoint is defined.');
      }
    };
    fetchStates();
  }, []);

  // Fetch districts when state changes (only if using an existing state)
  useEffect(() => {
    if (selectedState) {
      const fetchDistricts = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/location/districts/${selectedState}`, { withCredentials: true });
          setDistricts(res.data);
          setBlocks([]);
          setPanchayats([]);
          setVillages([]);
          setSelectedDistrict('');
          setSelectedBlock('');
          setSelectedPanchayat('');
          setSelectedVillage('');
        } catch (err) {
          setError('Failed to fetch districts: ' + (err.response?.data?.message || err.message));
        }
      };
      fetchDistricts();
    }
  }, [selectedState]);

  // Fetch blocks when district changes (only if using existing district)
  useEffect(() => {
    if (selectedState && selectedDistrict !== '') {
      const fetchBlocks = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/location/blocks/${selectedState}/${selectedDistrict}`, { withCredentials: true });
          setBlocks(res.data);
          setPanchayats([]);
          setVillages([]);
          setSelectedBlock('');
          setSelectedPanchayat('');
          setSelectedVillage('');
        } catch (err) {
          setError('Failed to fetch blocks: ' + (err.response?.data?.message || err.message));
        }
      };
      fetchBlocks();
    }
  }, [selectedState, selectedDistrict]);

  // Fetch panchayats when block changes (only if using existing block)
  useEffect(() => {
    if (selectedState && selectedDistrict !== '' && selectedBlock !== '') {
      const fetchPanchayats = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/location/panchayats/${selectedState}/${selectedDistrict}/${selectedBlock}`, { withCredentials: true });
          setPanchayats(res.data);
          setVillages([]);
          setSelectedPanchayat('');
          setSelectedVillage('');
        } catch (err) {
          setError('Failed to fetch panchayats: ' + (err.response?.data?.message || err.message));
        }
      };
      fetchPanchayats();
    }
  }, [selectedState, selectedDistrict, selectedBlock]);

  // Fetch villages when panchayat changes (only if using existing panchayat)
  useEffect(() => {
    if (selectedState && selectedDistrict !== '' && selectedBlock !== '' && selectedPanchayat !== '') {
      const fetchVillages = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/location/villages/${selectedState}/${selectedDistrict}/${selectedBlock}/${selectedPanchayat}`, { withCredentials: true });
          setVillages(res.data);
          setSelectedVillage('');
        } catch (err) {
          setError('Failed to fetch villages: ' + (err.response?.data?.message || err.message));
        }
      };
      fetchVillages();
    }
  }, [selectedState, selectedDistrict, selectedBlock, selectedPanchayat]);

  // Handle manual submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const stateName = newState || states.find(s => s.id === parseInt(selectedState))?.state;
    const districtName = newDistrict || districts.find(d => d.id === parseInt(selectedDistrict))?.name;
    const blockName = newBlock || blocks.find(b => b.id === parseInt(selectedBlock))?.name;
    const panchayatName = newPanchayat || panchayats.find(p => p.id === parseInt(selectedPanchayat))?.name;
    const villageName = newVillage || villages.find(v => v.id === parseInt(selectedVillage))?.name;

    if (!stateName || !districtName || !blockName || !panchayatName || !villageName) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/locationinsert/add', {
        state: stateName,
        district: districtName,
        block: blockName,
        panchayat: panchayatName,
        village: villageName,
      }, { withCredentials: true });
      setSuccess(res.data.message);
      setNewState('');
      setNewDistrict('');
      setNewBlock('');
      setNewPanchayat('');
      setNewVillage('');
      setSelectedState('');
      setSelectedDistrict('');
      setSelectedBlock('');
      setSelectedPanchayat('');
      setSelectedVillage('');
      // Reset fetched data
      setDistricts([]);
      setBlocks([]);
      setPanchayats([]);
      setVillages([]);
    } catch (err) {
      setError('Failed to add location: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle Excel file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setImportErrors([]);

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/locationinsert/import', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(res.data.message);
      if (res.data.errors) {
        setImportErrors(res.data.errors);
      }
    } catch (err) {
      setError('Failed to import locations: ' + (err.response?.data?.message || err.message));
    }
  };

  // Determine if we're entering a new state
  const isNewState = newState !== '';

  return (
    <Container fluid>
      <h2 className="my-4">Insert Location Data</h2>

      {/* Manual Entry Form */}
      <h4>Manual Entry</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>State</Form.Label>
          <Form.Control
            as="select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setNewState(''); // Clear newState if selecting an existing state
            }}
            disabled={states.length === 0}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>{state.state}</option>
            ))}
          </Form.Control>
          <Form.Control
            type="text"
            placeholder="Or enter new state"
            value={newState}
            onChange={(e) => {
              setNewState(e.target.value);
              setSelectedState(''); // Clear selectedState if entering a new state
              setDistricts([]); // Reset districts
              setBlocks([]); // Reset blocks
              setPanchayats([]); // Reset panchayats
              setVillages([]); // Reset villages
              setSelectedDistrict('');
              setSelectedBlock('');
              setSelectedPanchayat('');
              setSelectedVillage('');
            }}
            className="mt-2"
            disabled={states.length === 0}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>District</Form.Label>
          <Form.Control
            as="select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={(!selectedState && !isNewState) || (selectedState && districts.length === 0)}
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </Form.Control>
          <Form.Control
            type="text"
            placeholder="Or enter new district"
            value={newDistrict}
            onChange={(e) => {
              setNewDistrict(e.target.value);
              setSelectedDistrict(''); // Clear selectedDistrict if entering a new district
              setBlocks([]); // Reset blocks
              setPanchayats([]); // Reset panchayats
              setVillages([]); // Reset villages
              setSelectedBlock('');
              setSelectedPanchayat('');
              setSelectedVillage('');
            }}
            className="mt-2"
            disabled={(!selectedState && !isNewState)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Block</Form.Label>
          <Form.Control
            as="select"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            disabled={(!selectedDistrict && !newDistrict) || (selectedDistrict && blocks.length === 0)}
          >
            <option value="">Select Block</option>
            {blocks.map(block => (
              <option key={block.id} value={block.id}>{block.name}</option>
            ))}
          </Form.Control>
          <Form.Control
            type="text"
            placeholder="Or enter new block"
            value={newBlock}
            onChange={(e) => {
              setNewBlock(e.target.value);
              setSelectedBlock(''); // Clear selectedBlock if entering a new block
              setPanchayats([]); // Reset panchayats
              setVillages([]); // Reset villages
              setSelectedPanchayat('');
              setSelectedVillage('');
            }}
            className="mt-2"
            disabled={(!selectedDistrict && !newDistrict)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Panchayat</Form.Label>
          <Form.Control
            as="select"
            value={selectedPanchayat}
            onChange={(e) => setSelectedPanchayat(e.target.value)}
            disabled={(!selectedBlock && !newBlock) || (selectedBlock && panchayats.length === 0)}
          >
            <option value="">Select Panchayat</option>
            {panchayats.map(panchayat => (
              <option key={panchayat.id} value={panchayat.id}>{panchayat.name}</option>
            ))}
          </Form.Control>
          <Form.Control
            type="text"
            placeholder="Or enter new panchayat"
            value={newPanchayat}
            onChange={(e) => {
              setNewPanchayat(e.target.value);
              setSelectedPanchayat(''); // Clear selectedPanchayat if entering a new panchayat
              setVillages([]); // Reset villages
              setSelectedVillage('');
            }}
            className="mt-2"
            disabled={(!selectedBlock && !newBlock)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Village</Form.Label>
          <Form.Control
            as="select"
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            disabled={(!selectedPanchayat && !newPanchayat) || (selectedPanchayat && villages.length === 0)}
          >
            <option value="">Select Village</option>
            {villages.map(village => (
              <option key={village.id} value={village.id}>{village.name}</option>
            ))}
          </Form.Control>
          <Form.Control
            type="text"
            placeholder="Or enter new village"
            value={newVillage}
            onChange={(e) => {
              setNewVillage(e.target.value);
              setSelectedVillage(''); // Clear selectedVillage if entering a new village
            }}
            className="mt-2"
            disabled={(!selectedPanchayat && !newPanchayat)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={(!selectedState && !isNewState)}>Add Location</Button>
      </Form>

      {/* Excel Import Form */}
      <h4 className="mt-5">Bulk Import via Excel</h4>
      <Form onSubmit={handleFileUpload}>
        <Form.Group className="mb-3">
          <Form.Label>Upload Excel File</Form.Label>
          <Form.Control
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={states.length === 0}
          />
          <Form.Text className="text-muted">
            File must have columns: State, District, Block, Panchayat, Village
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={states.length === 0}>Import Locations</Button>
      </Form>

      {/* Import Errors */}
      {importErrors.length > 0 && (
        <div className="mt-4">
          <h5>Import Errors</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Row</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {importErrors.map((err, index) => (
                <tr key={index}>
                  <td>{JSON.stringify(err.row)}</td>
                  <td>{err.error}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default LocationInsert;