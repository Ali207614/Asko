import styled from "styled-components";
import colors from "../../../assets/style/colors";

const ChangeDateStyle = styled.div`
  .none {
    display: none;
  }
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
    background-color: #ffffff;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 5px 5px 10px #707070;
    text-align: center;
    width: 400px;
    .input {
      border: 2px solid ${colors.gray};
      font-size: 15px;
      padding: 10px;
      border-radius: 5px;
      color: ${colors.mainColor};
      width: 90%;
      margin-bottom: 20px;
    }
  }
  .centerCard {
    display: flex;
    justify-content: space-between;
    /* padding: 0 50px; */
  }
  .btnY {
    padding: 10px 30px;
    border-radius: 5px;
    border: 3px solid green;
    color: green;
    transition: 0.2s;
    font-weight: 600;
    font-size: 17px;
  }
  .btnY:hover {
    background-color: green;
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
    background-color: red;
    color: white;
  }
  .radioBtnCard {
    width: 150px;
    text-align: left;
    margin: auto;
  }
`;
export default ChangeDateStyle;
