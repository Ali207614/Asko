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
    padding: 10px 30px;
    border-radius: 5px;
    border: 3px solid #f9d507;
    color: #f9d507;
    transition: 0.2s;
    font-weight: 600;
    font-size: 17px;
  }
  .btnY:hover {
    background-color: #f9d507;
    color: white;
  }

  .btnN {
    padding: 10px 30px;
    border-radius: 5px;
    border: 3px solid red;
    color: red;
    transition: 0.2s;
    font-weight: 600;
    font-size: 17px;
  }
  .btnN:hover {
    background-color: #f9d507;
    color: white;
  }
  .img {
    width: 150px;
  }
  .mainTitle {
      margin: 0;
      padding: 0;
      font-size: 35px;
      color: #171717;
      font-weight: bold;
    }
  .title{
    color: #000;
    margin: 24px 0;

text-align: center;
font-variant-numeric: lining-nums tabular-nums stacked-fractions;
font-feature-settings: 'clig' off, 'liga' off;
font-family: "Inter Tight";
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 24px; 
  }
`;
export default Styles;
