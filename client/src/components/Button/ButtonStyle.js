import styled from 'styled-components';

const ButtonStyle = styled.div`
  .btn {
    padding: 10px 30px;
    border-radius: 4px;
    color: #ffffff;
    font-size: 15px;
    border: none;
    min-width: 150px;
    height: 32px;
    background-image: linear-gradient(to right bottom, #0b6885, #0a4d68);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 !important;
    -webkit-box-shadow: 4px 4px 52px 0px rgba(47, 47, 47, 0.15);
    -moz-box-shadow: 4px 4px 52px 0px rgba(47, 47, 47, 0.15);
    box-shadow: 4px 4px 52px 0px rgba(47, 47, 47, 0.15);
  }
  .btn2 {
    margin: 0 !important;
    padding: 5px 30px;
    border-radius: 4px;
    background-image: linear-gradient(to right bottom, #0b6885, #0a4d68);
    -webkit-box-shadow: 4px 4px 52px 0px rgba(47, 47, 47, 0.15);
    -moz-box-shadow: 4px 4px 52px 0px rgba(47, 47, 47, 0.15);
    box-shadow: 4px 4px 52px 0px rgba(47, 47, 47, 0.15);
    color: #ffffff;
    font-size: 15px;
    border: none;
    min-width: 150px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    .loaderIconStyle {
      animation: animationLoginLoader infinite;
      animation-duration: 3s;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      .loader {
        padding: 0 !important;
        margin: 0 !important;
      }
    }

    @keyframes animationLoginLoader {
      from {
        transform: rotateZ(0deg);
      }
      to {
        transform: rotateZ(360deg);
      }
    }
  }
`;
export default ButtonStyle;
