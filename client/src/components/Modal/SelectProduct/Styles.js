import styled from 'styled-components';
import colors from '../../../assets/style/colors';

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
    /* text-align: center; */
    padding: 10px 20px;
    min-width: 700px;
  }

  .img {
    width: 150px;
  }
  .mainConatiner {
    display: flex;
    flex-wrap: wrap;
    height: 305px;
    overflow: auto;
    padding-top: 10px;
  }
  table {
    background-color: #ffffff;
    width: 100%;
    /* border-radius: 10px; */
    padding: 5px;
    border-collapse: collapse;
    tr {
      cursor: pointer;
    }
    tr:hover {
      background-color: #efefef;
    }
    thead {
      background-color: ${colors.darkMainColor};
      border: none;
    }

    .bottomTr {
      td {
        text-align: center;
        padding: 5px 0;
        height: 30px;
      }
    }
    th {
      padding: 5px;
      color: #ffffff;
    }
    th,
    td {
      border: 1px solid #e2e2e2;
    }
  }

  .mainTitle {
    margin: 0;
    padding: 0;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .input {
    height: 30px;
    border-radius: 7px;
    border: 1px solid ${colors.lightGray};
    padding: 0 10px;
    font-size: 14px;
  }
  .input:focus {
    outline: none !important;
    border: 1px solid #3d94fc;
  }
  .between {
    display: flex;
    justify-content: space-between;
  }
  .loadingCard {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 345px;
    width: 100% !important;
    animation: animationLoginLoader infinite;
    animation-duration: 3s;
  }

  @keyframes animationLoginLoader {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(360deg);
    }
  }
`;
export default Styles;
