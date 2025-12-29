# Page snapshot

```yaml
- generic [ref=e4]:
  - banner [ref=e5]:
    - link "MyKartDL" [ref=e7] [cursor=pointer]:
      - /url: /
    - generic [ref=e8]:
      - link "Cart (1)" [ref=e9] [cursor=pointer]:
        - /url: /cart
        - button "Cart (1)" [ref=e10]
      - link "Login" [ref=e11] [cursor=pointer]:
        - /url: /login
        - button "Login" [ref=e12]
  - main [ref=e14]:
    - generic [ref=e15]:
      - heading "Register" [level=3] [ref=e16]
      - textbox "email" [ref=e17]: test+1767003466995@example.com
      - textbox "password" [active] [ref=e18]: Password123!
      - button "Register" [ref=e19]
      - button "Back to login" [ref=e20]
```