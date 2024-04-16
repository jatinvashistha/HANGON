export default {
    control: {
      // fontSize: 18,
    },
    "&multiLine": {
      control: {
      
        minHeight: 1,
      },
      highlighter: {
        // padding: 10,
        border: "2px solid transparent",
      },
      input: {
        border : "none",
        borderBottom : "1px solid black",
        overflow : "hidden", 
        width : "100%"
        
      },
    },
    "&singleLine": {
      display: "inline-block",
    
      highlighter: {
        // padding: 1,
        border: "2px inset transparent",
      },
      input: {
        // padding: 1,
        // border: "2px inset",
       
      },
    },
    suggestions: {
      // list: {
      //   backgroundColor: "white",
      //   border: "1px solid #333",
      //   fontSize: 18,
      // },
      item: {
        padding: "0px",

        
      },
    },
  };
  