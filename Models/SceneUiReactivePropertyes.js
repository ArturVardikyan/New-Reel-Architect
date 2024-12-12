const UiReactive = {

          Balance : new ReactiveProperty(-1),
          Win : new ReactiveProperty(0),
          WinOdd : new ReactiveProperty(0),
          LastWin : new ReactiveProperty(0),
          ShowTotalWin : new ReactiveProperty(false),
          TotalWin : new ReactiveProperty(0),
          TotalWinFreeBet : new ReactiveProperty(0),
           QuickBets : new ReactiveProperty(null),
          CurrencyCode : new ReactiveProperty(),
          Bet : new ReactiveProperty(0),
          PreviewStateBets : new ReactiveProperty(0),
          GuaranteedWin : new ReactiveProperty(false),
          GuaranteedWinPreviewState : new ReactiveProperty(false),
          InfoTable : new ReactiveProperty(0),
          X2 : new ReactiveProperty(0),
          MaintenanceSecond : new ReactiveProperty(0),
          IsOnMaintenance : new ReactiveProperty(false),

          Rate : new ReactiveProperty(1),
          MaxOdd : new ReactiveProperty(0),

         SymbolOdds : new ReactiveProperty(),
         UserNonStandardFreeBetAmount : new ReactiveProperty(),

        //Commands
          ShowX2 :  new rxjs.Subject(),
          ReelEffect :  new rxjs.Subject(),
          HideReelsEffect :  new rxjs.Subject(),

}