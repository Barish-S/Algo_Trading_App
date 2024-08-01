const Forward = () => {
  const [inputData, setInputData] = useState([]);
  const getData = () => {
    let formData = new FormData();
    formData.append("date", inputData.date);
    formData.append("open_price", inputData.open_price);
    formData.append("volume", inputData.volume);
    formData.append("average", inputData.average);
    formData.append("profit", inputData.profit);
    formData.append("loss", inputData.loss);

    axios.post('http://127.0.0.1:5000/start-trading', formData)
      .then((res) => {
        console.log("Response from server:", res);
        alert("Success");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert('ERROR');
      });
};

  return (
    <>
      <Navbar />
      <main className='main-container'>
        <div className='main-title'>
          <h1>Live Data | Forward</h1>
        </div>
        <div className='inputs'>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Date</b>
            </InputGroup.Text>
            <Form.Control
              type='text'
              aria-label="Default"
              placeholder='YYYYMMDD'
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, date: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>From-Time</b>
            </InputGroup.Text>
            <Form.Control
              type='time'
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, from_time: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>To-Time</b>
            </InputGroup.Text>
            <Form.Control
              type='time'
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, to_time: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Open Price</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, open_price: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Volume</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, volume: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Average</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, average: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Profit</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, profit: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Loss</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, loss: e.target.value })}
            />
          </InputGroup>
          <Button type='button' variant='danger' onClick={()=>getData()} style={{ marginBottom: '15px' }}>Submit</Button>
        </div>
      </main>
    </>
  );
};

export default Forward;
