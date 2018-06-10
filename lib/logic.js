/**
 * Add Lender
 * @param {org.ayuda.CreateLender} createLender
 * @transaction
 */
function createLender(createLender){
    var factory= getFactory();
    var NS = 'org.ayuda';
    var lender=factory.newResource(NS,'Lender',createLender.aadhar);
    lender.name = createLender.name;
    lender.email=createLender.email;
    lender.paidforLoan=[];

    return getParticipantRegistry('org.ayuda.Lender')
    .then(function(lenderRegistry) {
      return lenderRegistry.add(lender);
    });
}

/**
 * Add Borrower
 * @param {org.ayuda.CreateBorrower} createBorrower
 * @transaction
 */
 function createBorrower(createBorrower) {
   var factory = getFactory();
   var NS = 'org.ayuda';
   var borrower = factory.newResource(NS,'Borrower',createBorrower.aadhar);
   var pastrecord=factory.newConcept(NS,'PastRecord');
   borrower.name= createBorrower.aadhar;
   borrower.email=createBorrower.email;
   borrower.phone=createBorrower.phone;
   pastrecord.industry=createBorrower.pastrecord.industry;
   pastrecord.yearInBusiness=createBorrower.pastrecord.yearInBusiness;
   pastrecord.fundsTillNow=createBorrower.pastrecord.fundsTillNow;
   borrower.pastRecord=createBorrower.pastrecord;


   return getParticipantRegistry('org.ayuda.Borrower')
      .then(function(borrowerRegistry) {
        return borrowerRegistry.add(borrower);
      });
 }




 /**
  * Ask for a loan
  *@param {org.ayuda.CreateLoan} createLoan
  *@transaction
  */

  function createLoan(createLoan) {
    var factory=getFactory();
    var NS = 'org.ayuda';
    var loan=factory.newResource(NS,'Loan',createLoan.loanId);
    var borrower = factory.newRelationship(NS,'Borrower',createLoan.borrower.aadhar);
    loan.borrower=createLoan.borrower;
    loan.fieldPartnerId=createLoan.fieldPartnerId;
    loan.loanAmount=createLoan.loanAmount;
    loan.amountFulfilled=0;
    loan.story=createLoan.story;
    loan.loanDuration=createLoan.loanDuration;
    loan.payLoan=[];
    loan.interest=[];
    var theborrower = createLoan.borrower;
    theborrower.loan=loan;

    return getAssetRegistry('org.ayuda.Loan')
       .then(function(loanRegistry) {
         return loanRegistry.add(loan);
       })
       .then(function() {
         return getParticipantRegistry('org.ayuda.Borrower');
       })
       .then(function(borrowerRegistry) {
         return borrowerRegistry.update(theborrower);
       });
  }

  /**
   * Pay for a loan
   * @param {org.ayuda.PayLoan} payLoan
   * @transaction
   */

   function payLoan(payLoan) {
     var factory= getFactory();
     var NS = 'org.ayuda';
     var loan = payLoan.loan;
     var lender = payLoan.lender;
     var borrower= loan.borrower;
     if(borrower.loan.amountFulfilled+payLoan.amount<=loan.loanAmount)
    {
      if(payLoan.amount==0)
      {
        throw new Error('You did not enter the amount to lend');
      }
      else {


      borrower.loan.amountFulfilled+=payLoan.amount;
    borrower.loan.payLoan.push(payLoan);
     lender.paidforLoan.push(payLoan);
   }
   }
   else {
     throw new Error('Right now the lender doesent want that much!');
   }




     return getAssetRegistry('org.ayuda.Loan')
       .then(function(loanRegistry) {
         return loanRegistry.update(loan);
       })
       .then(function(){
         return getParticipantRegistry('org.ayuda.Lender');
       })
       .then(function(lenderRegistry) {
         return lenderRegistry.update(lender);
       })
       .then(function() {
         return getParticipantRegistry('org.ayuda.Borrower');
       })
       .then(function(borrowerRegistry) {
         return borrowerRegistry.update(borrower);
       });

   }



   /**
    * For paying back the loan
    *@param {org.ayuda.PayBack} payBack
    *@transaction
    */
    function payBack(payBack) {
      var factory=getFactory();
      var NS='org.ayuda';
      var loan = payBack.loan;

      for(var i=0;i<loan.payLoan.length;i++)
      {
        var interest = factory.newConcept(NS,'Interest');
        interest.lender=loan.payLoan[i].lender;
        interest.rate=String(calcMyInterest(loan.payLoan[i].amount,loan.loanAmount,5,2));

        loan.borrower.loan.interest.push(interest);
      }

      return getAssetRegistry('org.ayuda.Loan')
      .then(function(loanRegistry) {
        return loanRegistry.update(loan);
      })
      .then(function() {
        return getParticipantRegistry('org.ayuda.Borrower');
      })
      .then(function(borrowerRegistry) {
        return borrowerRegistry.update(loan.borrower);
      })
    }


    function calcMyInterest(mydeposit, totaldeposit, fixedpc, fppc) {
	var rem_money = totaldeposit - fixedpc - fppc;
	var myIncentive = Math.exp((mydeposit - rem_money) / mydeposit);
	var sum = rem_money + fppc;
	return ((mydeposit * simpleInterest(totaldeposit, 1, 22)) / rem_money);
}

function simpleInterest(p, t, r) {
	return (p * t * r) / 100;
}
