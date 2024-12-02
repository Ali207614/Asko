import styled from 'styled-components';

const LaunchStyle = styled.div`
  .container {
    flex: 1;
    display: flex;
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    height: 90vh;

    .img {
      width: 561px;
      height: 156px;
      animation-name: launchAnimation;
      animation-duration: 2s;
      scale: 1;
    }
  }
  @keyframes launchAnimation {
    from {
      transform: translateY(50px);
      scale: 0.7;
    }
    to {
      transform: translateY(0);
      scale: 1;
    }
  }
`;
export default LaunchStyle;
