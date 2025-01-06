import styled from 'styled-components';

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
    z-index: 1000;
  }
  .card {
    text-align: center;
  }
 .noBtn{
  border: 1px solid #E41B12;
  color:  #E41B12;
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
  margin-top: 12px;
  margin-bottom: 54px;
 }
  .yesBtn{
  background:  #E41B12;
  color:  #FFF;
  border:none;
 }

 .btn{
  border-radius:  8px;
  padding:9px 12px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  outline:none;
  width: 121px;
 }

 .centerCard{
  display: flex;
  align-items: center;
  justify-content: space-between;
 }
 
`;
export default Styles;
