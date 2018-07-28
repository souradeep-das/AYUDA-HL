function reputationCheck(currReputation, returnTime) {
	var today = new Date();
	var timesnow = String(today.getHours()) + String(today.getMinutes()) + String(today.getSeconds());

	var repChange;
	if(timesnow > returnTime) {
		repChange = ((timesnow - returnTime) / returnTime) * 5;
	} else if(timesnow < returnTime) {
		repChange = ((returnTime - timesnow) / returnTime) * 5;
	} else {
		repChange += 0.5;
	}
	return repChange;
}