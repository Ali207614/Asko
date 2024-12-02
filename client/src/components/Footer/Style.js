import styled from 'styled-components';

const Style = styled.div`
  .container {
    padding: 40px;
    .row {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .col3 {
    width: calc(100% / 3);
  }
  .title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 10px;
  }
  .desc {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
    cursor: pointer;
  }

  @media only screen and (max-width: 1000px) {
    .col3 {
      width: 50%;
    }
  }

  @media only screen and (max-width: 600px) {
    .col3 {
      width: 100%;
    }
  }
`;
export default Style;
