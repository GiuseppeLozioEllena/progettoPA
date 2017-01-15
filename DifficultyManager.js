/*
 * DifficultyManager
 * Classe che gestisce il livello di difficolt�
 */
DifficultyManager = function (liv) {
	this.level = liv;
	
	this.numeroBaseAsteroidi = [1,2,3];
	this.aumentoAsteroidi = [1,2,3];
	
	this.incrementoCostante = [0.1, 0.2, 0.3];
	
	this.intervalloTurbo = [6, 8, 12];

	this.calcolaNumeroAsteroidi = calcolaNumeroAsteroidi;
	this.calcolaMoltiplicatore = calcolaMoltiplicatore;
	this.getTurboSleepTime = getTurboSleepTime;
	
	/*
	 * calcolaNumeroAsteroidi
	 * Calcola il numero di asteoridi presenti in scena dipendemente dal tempo e dalla difficolt�
	 */
	function calcolaNumeroAsteroidi(time)
	{
		var f = parseInt(time / 100);
		return this.numeroBaseAsteroidi[this.level] + f * this.aumentoAsteroidi[this.level];
	}
	
	/*
	 * calcolaMoltiplicatore
	 * Calcola il moltiplicatore della costante di gravitazione universale (non tanto costante in questo caso)
	 * da applicare, pi� il tempo � alto pi� la costante aumenta.
	 */
	function calcolaMoltiplicatore(time)
	{
		var f = parseInt(time / 100);
		return 1 + f * this.aumentoAsteroidi[this.level];
	}
	
	/*
	 * getTurboSleepTime
	 * Ritorna quanti secondi il turbo deve rimanere disattivato dopo l'utilizzo
	 * Cambia solo in base alla difficolt�, non al tempo
	 */
	function getTurboSleepTime()
	{
		return this.intervalloTurbo[this.level];
	}
}