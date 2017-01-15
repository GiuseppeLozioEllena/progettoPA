/*
 * DifficultyManager
 * Classe che gestisce il livello di difficoltà
 */
DifficultyManager = function (liv) {
	this.level = liv;
	
	this.numeroBaseAsteroidi = [1,2,3];
	this.aumentoAsteroidi = [1,2,3];

	this.calcolaNumeroAsteroidi = calcolaNumeroAsteroidi;
	
	function calcolaNumeroAsteroidi(time)
	{
		var f = int.parse(time / 100);
		return this.numeroBaseAsteroidi[this.level] + f * this.aumentoAsteroidi[this.level];
	}
}