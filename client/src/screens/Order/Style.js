import styled from "styled-components";

const Style = styled.div`
li{
  list-style: none;
} 
.overlay {
  position: fixed; /* Overlayni butun ekran bo'ylab ko'rsatish uchun */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Yarim shaffof qora fon */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Overlay boshqa kontentdan ustun turishi uchun */
}
.title-menu{
  color:  #000;
    font-style: normal;
    line-height: normal;
    margin-left: 35px;
}
.truncated-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}

.truncated-text:hover::after {
  content: attr(title);
  position: absolute;
  background: #333;
  color: #fff;
  padding: 5px;
  border-radius: 3px;
  white-space: nowrap;
  top: -25px; /* Balandligi */
  left: 0;
  z-index: 10;
  font-size: 12px;
}
.table-body-list{
  padding-bottom: 200px;
}

.opacity-5{
  opacity: 0.5;
}

.container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    width: 1400px;
  }
  .btn-head{
    width: 121px;
    height: 36px;
  padding: 9px 12px;
  border-radius: 8px;
  background: #298AFF;
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
  .btn-back{
    border-radius:  8px;
    background:  #F4F4F4;
    padding: 9px 12px;

    color:  #1C1C1C;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    text-align:center;
    outline:none;
    border: 1px solid #E9E9E9;
  }
  .order-main{
    margin:24px 0;
  }
  .display-n{
    display:none;
  }
  .display-b{
    display:block;
  }
  .d-flex{
    display:flex;
  }

  .align{
    align-items:center;
  }

  .justify{
    justify-content:space-between;
  }
  .w-100{
    width:100%;
  }

 

  .order-inp{
    border-radius: 8px;
    background:  #F7F8F9;
    width: 219px;
    padding:  10px 16px ;
    outline:none;
    border:none;
    border: 1px solid #E9E9E9;
    width:96%;
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
  }


  .right-head{
    display:flex;
    align-items:center;
    justify-content: end;
  }
  .right-inp{
    border-radius: 8px;
    background:  #F7F8F9;
    width: 219px;
    padding:10px 16px 10px 46px;
    outline:none;
    border:none;
    border: 1px solid #E9E9E9;
  }
  .right-input{
    position:relative;
    display:inline-block;
  }
  .right-input-img{
    position:absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 16px;
  }
  .right-inp::-webkit-input-placeholder {
    color: #3C3F47;
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }
  .right-filter{
    outline:none;
    border:none;
    width:36px;
    height:36px;
    background:  #F7F8F9;
    border-radius: 8px;
    margin:0 6px;
    border: 1px solid #E9E9E9;

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
  .right-pagination{
    display:flex;
    align-items:center;
  }
  .pagination-button{
    border-radius: 12px;
    border: 1px solid  #E9E9E9;
    background: #FFF;
    width: 36px;
    height: 36px;
    padding: 8px;
    margin-left: 6px;
  }
  .left-pagination{
    transform: rotate(180deg);
  }
  .pagination-text{
    color: var(--Grey-Grey--500, #A4A4A4);
    font-variant-numeric: lining-nums tabular-nums stacked-fractions;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: "Inter Tight";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; 
    margin-right: 12px;
    width:130px;
    text-align: end;
  }
  .opcity-5{
    opacity:0.5;
  }
  .order-head-filter{
    margin:24px 0;
  }
  .margin-right{
    margin-right:12px;
  }


  .margin-right{
    margin-right:12px;
  }




  .d-flex{
    display:flex;
  }

  .align{
    align-items:center;
  }

  .justify{
    justify-content:space-between;
  }
  .w-100{
    width:100%;
  }
  .m-right-16{
    margin-right:16px;
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

  .table-item-foot{
    display:none;
  }
  .table-head-item{
    color:  #585858;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    width: 100%;
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
    padding:7px 12px;
    width: 134px;
    outline:none;
    color:  #585858;
    font-family: "Inter Tight";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .add-block{
  }
  .w-47px{
    width:47px;
  }


  .select-items {
    background: #F7F8F9;
    border-top:1px solid #E9E9E9;
    width:100%;
    bottom:0;
    height:280px;
  }
  .select-items-filter{
    padding:24px 0;
  }
  .bg-white{
    background:#fff;
  }

  .react-resizable-handle{
    width: 100%;
    border-top: 1px solid #E9E9E9;
    background-image:none;
    transform: none;
    left: 0;
    margin:0;
    padding:5px;
  }


  .tab-table {
    flex-grow: 1;
    overflow: auto;
  }

  .tab-table::-webkit-scrollbar {
  width: 0;
}
.borderRed{
  border:1px solid #298AFF;
}
/* .tab-table::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
.tab-table::-webkit-scrollbar-thumb {
  background: #888; 
    border-radius:10px;
}
.tab-table::-webkit-scrollbar-thumb:hover {
  
  background: #555; 
}  */

.w-50{
  width: 50%;
}

.position-relative{
  position: relative;
}
.dropdown-menu {
    flex-grow: 1;
    overflow: auto;
  }

  .dropdown-menu::-webkit-scrollbar {
  width: 0;
}
.dropdown-menu{
    position:absolute;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    max-height:400px ;
    position: absolute;
    max-width: 96%;
    top: 41px;
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

  .close-btn{
  outline: none;
  border:none;
  background-color: transparent;
  position: absolute;
  right: 0px;
  top: -10px;
  border-radius: 50%;
  border: 1px solid #EEE;
  background: #FFF;
  width: 18px;
  height: 18px;
}


.footer-block{
  background-color: #fff;
  padding: 10px 12px;
  border-radius: 12px;
border: 1px solid  #E9E9E9;
margin-left: 12px;
}

.footer-text{
    color: #000;
font-variant-numeric: lining-nums tabular-nums stacked-fractions;
font-feature-settings: 'clig' off, 'liga' off;
font-size: 13px;
font-style: normal;
font-weight: 500;
line-height: normal;
}
.w-70{
    width: 70%;
  }
`;
export default Style;
