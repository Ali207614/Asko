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
  flex-wrap:wrap
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
    max-height: 200px;
    position: absolute;
    max-width: 96%;
    overflow: auto;
  }
  .dropdown-menu::-webkit-scrollbar {
  width: 0;
}
.btn-head{
    width: 121px;
    height: 36px;
  padding: 9px 12px;
  border-radius: 8px;
  background: #E41B12;
  color: #FFF;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  text-align: center;
  outline: none;
  border: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  }
.table::-webkit-scrollbar {
  width: 0;
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
    background:  #E41B12;
    margin-left: 12px;
    outline: none;
    border:none;
    width: 130px;
  }
  .card-btn-clear{
    color:  #E41B12;
  border: 1px solid #E41B12;
  background-color: transparent;

  }
  .card-buttons{
    display: flex;
    align-items: center;
    justify-content: end;
  }


  .order-inp{
    border-radius: 8px;
    background:  #F7F8F9;
    padding:  10px 16px ;
    outline:none;
    border:none;
    border: 1px solid #E9E9E9;
    color: #3C3F47;
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    resize: none;

  }
  .order-inp::-webkit-input-placeholder {
    color: #3C3F47;
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    opacity: 0.6;

  }


  .up-arrow{
    transform: rotate(180deg);
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
    width:140px;
    height:36px;
    background:  #F7F8F9;
    border-radius: 8px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    padding:0 10px;
    border: 1px solid  #E9E9E9;

  }
  .partner-item{
    margin-right: 20px;
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

  .display-n{
    display:none;
  }
  .display-b{
    display:block;
  }

  .dropdown-active{
    background:  #dadcde;
  }


.justify {
    justify-content: space-between;
}
.cwUAiW .align {
    align-items: center;
}
.card{
  padding: 20px;
  padding-bottom: 0px;
}
.d-flex {
    display: flex;
}
.table{
  height: 500px;
  overflow: auto;
  margin-top: 20px;
}

  .table-body-text{
    color:  #3C3F47;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .table-head-list{
    padding:16px;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
  }
  .table-body-item{
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
  }
  
  .table-item-head{
    border-top: 1px solid #E9E9E9;
    padding:0 16px;
  }
  .close-filter{
    border:none;
    background-color: transparent;
    outline: none;
    text-align: right;
    margin-bottom: 20px;
    width: 100%;
  }
  
  .active-table{
    border-left: 1px solid #E9E9E9;
    border-right: 1px solid #E9E9E9;
    background: #F7F8F9; 
    .table-item-foot{
      padding:16px;
      display:flex;
      border-top: 1px solid #E9E9E9;
    }
  }

  .inp-checkbox{
    width:16px;
    height:16px;
  }
.table-item-child{
  width: 30%;
  text-align: left;
}
  .table-item-foot{
    display:none;
  }
  .table-head-item{
    color:  #585858;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    width: 30%;
    text-align: left;
  }
  .info-bp{
    color:  #585858;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-right: 20px;
  }
  .bp-summa{
    color:  #3C3F47;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .bp-block{
    width: 100%;
    margin-left: 20px;
  }
  .p-16{
    padding:16px 0;
  }
 
  .table-item-btn{
    border-radius: 8px;
    border: 1px solid  #E9E9E9;
    background: #FFF;
    padding:2px 12px;
    margin-right:12px;
  }
  .isCommited{
    color:#585858;
  }

  .table-head-check-btn{
    outline:none;
    background:none;
    border:none;
  }

  .table-body-inp{
    border-radius: 8px;
    border: 1px solid  #E9E9E9;
    background:  #F7F8F9;
    padding:10px 12px;
    width: 134px;
    outline:none;
    color:  #585858;
    font-family: "Inter Tight";
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .w-100{
    width:100%;
  }
  .w-50{
    width:50%;
  }
  .w-70{
    width:70%;
  }
`;
export default Styles;
