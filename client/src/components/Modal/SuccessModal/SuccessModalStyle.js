import styled from 'styled-components';
import colors from '../../../assets/style/colors';

const ErrorModalStyle = styled.div`
  .card {
    background-color: #ffffff;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    min-height: 330px;
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
      height: 150px;
      object-fit: cover;
    }
    .title {
      margin: 0;
      padding: 0;
      font-size: 20px;
      color: #6d6d6d;
      font-weight: 600;
      margin-top: 10px;
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
      border: 3px solid #21c732;
      color: #21c732;
      transition: 0.2s;
      font-weight: 600;
      font-size: 17px;
    }
    .btnN:hover {
      background-color: #21c732;
      color: white;
    }
  }
`;
export default ErrorModalStyle;
