import styled from "styled-components";
import colors from "../../../assets/style/colors";

const CreateUserStyle = styled.div`
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
    padding: 0 30px;
    text-align: center;
    width: 400px;
    min-height: 380px;
    .input {
      border: 2px solid ${colors.blue2};
      font-size: 15px;
      padding: 10px;
      border-radius: 5px;
      color: ${colors.blue1};
      width: 90%;
      margin-bottom: 20px;
      outline: none;
    }
  }
  .cancelCard {
    position: absolute;
    top: 20px;
    right: 20px;
    color: ${colors.blue2};
  }
  .ac {
    background-color: ${colors.blue2};
    color: #ffffff;
    border: none;
    padding: 5px;
    width: 100px;
    border-radius: 10px;
    align-items: center;
  }
  .inac {
    background-color: #e3e3e3;
    border: none;
    padding: 5px;
    width: 100px;
    border-radius: 10px;
    align-items: center;
  }
  .between {
    display: flex;
    justify-content: space-between;
    padding: 0 70px;
    margin-bottom: 30px;
  }
  .btnTitle {
    font-size: 12px;
    margin: 0;
    padding: 0;
  }
  .centerCard {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
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
export default CreateUserStyle;
