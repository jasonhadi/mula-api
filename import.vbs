Sub ImportData()

Dim objXML As MSXML2.DOMDocument
Set objXML = New MSXML2.DOMDocument
objXML.Load ("C:\Users\jhadi\Documents\ExpenseTool\test.xml")

'Load Info Section
Range("G3").Value = objXML.SelectSingleNode("/expensesheet/username").Text
Range("G4").Value = Now
Range("G5").Value = objXML.SelectSingleNode("/expensesheet/expCurrency").Text
Range("G6").Value = objXML.SelectSingleNode("/expensesheet/reimbCurrency").Text
Range("G7").Value = objXML.SelectSingleNode("/expensesheet/oldestBillDate").Text

'Load Activities
Set activities = objXML.SelectNodes("/expensesheet/activities")
For Each activity In activities
    aNumber = activity.SelectSingleNode("row/number").Text
    Range("num" & aNumber & "Assignment").Value = activity.SelectSingleNode("type").Text
    Range("num" & aNumber & "Project").Value = activity.SelectSingleNode("project").Text
    Range("X" & aNumber).Value = activity.SelectSingleNode("description").Text
    
    For Each receipt In activity.SelectNodes("receipts")
        rNumber = receipt.SelectSingleNode("number").Text
        rowNumber = CInt(receipt.SelectSingleNode("number").Text) + 17
        rType = receipt.SelectSingleNode("type").Text
   
        Range("E" & rowNumber).Value = receipt.SelectSingleNode("number").Text
        Range("detail" & rNumber).Value = receipt.SelectSingleNode("activity").Text
        Range("G" & rowNumber).Value = receipt.SelectSingleNode("where").Text
        Range(rType & rowNumber).Value = receipt.SelectSingleNode("value").Text
    Next
    
Next

End Sub
