function simpleInterest(p, t, r) {
	return (p * t * r) / 100;
}

function calcMyInterest(mydeposit, totaldeposit, fixedpc, fppc) {
	let rem_money = totaldeposit - fixedpc - fppc;
	var myIncentive = Math.exp((mydeposit - rem_money) / mydeposit);
	var sum = rem_money + fppc;
	return ((myIncentive / rem_money) * sum);
}

console.log("hello")