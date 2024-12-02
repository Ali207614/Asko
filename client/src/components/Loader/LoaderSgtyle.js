import styled from "styled-components";

const LoaderStyle = styled.div`
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 40px;
  margin: 0;
  padding: 0;
  animation: animationForLoader 5s infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes animationForLoader {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
export default LoaderStyle;
