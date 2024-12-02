import styled from 'styled-components';

const Styles = styled.div`
  .modal {
    background-color: #00000077;
    position: fixed;
    top: 0%;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card {
    text-align: center;
    padding: 10px 20px;
    min-width: 300px;
  }
  .btnY {
    padding: 10px;
    border-radius: 5px;
    border: 3px solid #656565;
    color: #656565;
    transition: 0.2s;
    font-weight: 600;
    font-size: 17px;
    width: 150px;
  }
  .btnY:hover {
    background-color: #656565;
    color: white;
  }
  .btnN {
    padding: 10px;
    border-radius: 5px;
    border: 3px solid #656565;
    color: #656565;
    transition: 0.2s;
    font-weight: 600;
    font-size: 17px;
    width: 150px;
  }
  .btnN:hover {
    background-color: #656565;
    color: white;
  }
  .img {
    width: 150px;
  }
  .centerCard {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
  }
`;
export default Styles;
