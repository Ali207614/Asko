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
.card-left{
  border-right: 1px solid  #E9E9E9;
  background: #F7F8F9;
  padding: 24px;
  width: 25%;
}

.card-left-title{
  text-align: left;
  color: #3C3F47;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.filter-title{
  color:  #3C3F47;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: normal;
margin-bottom: 12px;
text-align: left;
}
.card-right{
  padding: 24px;
  width: 100%;
}
.card-filter{
  margin-bottom:24px;
}

.df{
  display: flex;
}
.align{
  align-items: center;
}
.justify{
  justify-content: space-between;
}
.mr-24{
  margin-right: 24px;
}

.checkbox-filter{
  width: 16px;
  height: 16px;
}
.checkbox-label{
  color: #8E97A9;
font-family: "Inter Tight";
font-size: 15px;
font-style: normal;
font-weight: 400;
line-height: normal;
margin-left: 8px;
}
.filter-wrapper{
  flex-wrap:wrap;
  flex-direction: column;
    align-items: baseline;
}
.filter-wrapper-inner{
  margin-bottom: 8px;
}
.filter-manager{
  margin-bottom: 17px;
}
.filter-inp{
  border-radius: 8px;
    background:  #F7F8F9;
    padding:  10px 16px ;
    outline:none;
    border:none;
    border: 1px solid #E9E9E9;
    width:100%;
    color: #3C3F47;
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    resize: none;
}
.filter-inp::-webkit-input-placeholder {
    color: #3C3F47;
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }
 
  .right-limit{
    position:relative;
  }
  .right-limit-text{
    color:  #3C3F47;
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; 
  }
  .right-dropdown{
    outline:none;
    border:none;
    width:98px;
    height:36px;
    background:  #F7F8F9;
    border-radius: 8px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    padding:0 16px;
    border: 1px solid  #E9E9E9;
  }
  .dropdown-menu{
    position:absolute;
    width:100%;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    top: 38px;
    border-radius: 4px;
  }

  .dropdown-item{
    color:  #3C3F47;
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; 
   text-decoration:none;
   padding:0 16px;
  }
  .dropdown-li{
    list-style:none;
    background:  #F7F8F9;
  }
  .dropdown-li:hover{
    background:  #dadcde;
  }

  .dropdown-active{
    background:  #dadcde;
  }
  .up-arrow{
    transform: rotate(180deg);
  }
  .display-n{
    display:none;
  }
  .display-b{
    display:block;
  }
  .close-filter{
    position: absolute;
    top: 24px;
    right: 24px;
    border:none;
    background-color: transparent;
    outline: none;
  }
  .card-btn-filter{
    color:  #FFF;
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: "Inter Tight";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px; /* 150% */
    padding: 9px 12px;
    border-radius:  8px;
    background:  #298AFF;
    margin-left: 12px;
    outline: none;
    border:none;
    width: 130px;
  }
  .card-btn-clear{
    color:  #298AFF;
  border: 1px solid #298AFF;
  background-color: transparent;

  }
  .card-buttons{
    display: flex;
    align-items: center;
    justify-content: end;
  }
`;
export default Styles;
