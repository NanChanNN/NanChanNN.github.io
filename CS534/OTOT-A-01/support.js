
var key_list = ["Corporate Income Tax", "Personal Income Tax", "Goods and Services Tax",
        "Net Investment Returns", "Motor Vehicle Taxes and Fees", "Customs, Excise and Carbon Taxes",
        "Assets Taxes", "Betting Taxes", "Stamp Duty", "Other Fees and Charges", "Statutory Boards' Contributions",
        "Others Taxes"]

var key_description = [
    "Corporate Income Tax refers to the tax on the income of a company earned in the preceding financial year.",
    "Personal Income Tax refers to the tax on the income of individuals earned in Singapore.",
    "Goods and Services Tax refers to the tax on goods and services sold in Singapore for consumption.",
    "Net Investment Returns comprises: Up to 50% of the Net Investment Returns (NIR) on the net assets invested by GIC, MAS and Temasek; and, Up to 50% of the Net Investment Income (NII) derived from past reserves from the remaining assets.",
    "Motor Vehicle Taxes and Fees comprises of Motor Vehicle Taxes and Vehicle Quota Premiums.",
    "Customs andExcise Taxes refer to the tax on All dutiable goods imported into or manufactured in Singapore, while Carbon Taxes refers to the tax on GHG emissions.",
    "Assets Taxes refers to the tax imposed on owners of properties based on the expected rental values of the properties.",
    "Betting Taxes refers to the tax imposed on private lottery, betting & sweep-stake.",
    "Stamp Duty refers to the tax imposed on commercial and legal documents relating to stock & shares and immovable property.",
    "Other Fees and Charges refer to fees imposed by the government excluding Excluding Vehicle Quota Premiums.",
    "Statutory Boards' Contributions refers to contributions from statutory boards of the government.",
    "Others Taxes include Foreign Worker Levy, Water Conservation Tax, Development Charge and Annual Tonnage Tax.",
]

var project_introduction = "This project visualises the composition of the revenue of the Singapore Government from 2008 to 2020. The data used in this project is collected from data published by  the Ministry of Finance (Singapore), and the annual revenue is broken into 12 components encoded as different colours in the chart. The canvas on the top part is a streamgraph which gives a global view of changes in the annual revenue. Users can hover the mouse over each streamline to highlight it for analysis of changes in different revenue sources along time. When clicking on a certain stream, the scatter plot on the bottom will displays the actual value (in billion) of such revenue source as well as the percentage it takes in the total revenue. On the right of the scatter plot we give an exact definition of the selected revenue source for further understanding. When hovering over elements, the scatter plot will show in a tooltip the exact value of the element."