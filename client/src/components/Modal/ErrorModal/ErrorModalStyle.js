import styled from 'styled-components';
import colors from '../../../assets/style/colors';

const ErrorModalStyle = styled.div`
  .card {
    background-color: #ffffff;
    text-align: center;
    flex-wrap: wrap;
    .cardTop {
      width: 100%;
    }
    .cardBottom {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
    }
    .img {
      width: 130px;
      object-fit: cover;
    }
    .mainTitle {
      margin: 0;
      padding: 0;
      font-size: 35px;
      color: #171717;
      font-weight: bold;
    }
    .centerCard {
      display: flex;
      justify-content: center;
      padding: 0 50px;
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
  }
  .title{
    color: #000;

text-align: center;
font-variant-numeric: lining-nums tabular-nums stacked-fractions;
font-feature-settings: 'clig' off, 'liga' off;
font-family: "Inter Tight";
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 24px; 
margin: 24px 0;
  }
`;
export default ErrorModalStyle;
