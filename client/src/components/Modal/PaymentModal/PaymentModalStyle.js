import styled from "styled-components";
import colors from "../../../assets/style/colors";

const PaymentModalStyle = styled.div`
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
    padding: 10px 30px 30px 30px;
    text-align: center;
    width: 400px;
  }
  .centerCard {
    display: flex;
    justify-content: space-between;
    /* padding: 0 50px; */
  }
  .btnY {
    padding: 10px 30px;
    border-radius: 5px;
    border: 3px solid #21c732;
    color: #21c732;
    transition: 0.2s;
    font-weight: 600;
    font-size: 17px;
  }
  .btnY:hover {
    background-color: #21c732;
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
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
  .radioBtnCard2 {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  .ac {
    background-color: ${colors.blue2};
    color: #ffffff;
    border: none;
    padding: 10px 10px;
    width: 80px;
    border-radius: 10px;
    align-items: center;
  }
  .inac {
    background-color: #e3e3e3;
    border: none;
    padding: 10px 10px;
    width: 80px;
    border-radius: 10px;
    align-items: center;
  }
  .btnTitle {
    margin: 0;
    padding: 0;
  }
  .halfCard {
    display: flex;
    .insideMiniCard {
      flex: 1;
      .input {
        border: 2px solid ${colors.gray};
        font-size: 15px;
        padding: 10px;
        border-radius: 5px;
        color: ${colors.mainColor};
        width: 80%;
        height: 10px;
        outline: none;
      }
      .redInput {
        border: 2px solid red;
        font-size: 15px;
        padding: 10px;
        border-radius: 5px;
        color: ${colors.mainColor};
        width: 80%;
        height: 10px;
        outline: none;
      }
    }
  }
`;
export default PaymentModalStyle;
