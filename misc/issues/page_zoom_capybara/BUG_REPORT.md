
<!--- Provide a general summary of the issue in the Title above -->

## Expected Behavior
zoom the browser
<!--- Tell us what should happen -->

## Current Behavior
does not zoom
<!--- Tell us what happens instead of the expected behavior -->

## Possible Solution

* contacted https://github.com/shs96c,https://github.com/shs96c
* placed issue on gitter

<!--- Not obligatory, but suggest a fix/reason for the bug, -->

## Steps to Reproduce
```rb
# can use  %{-} and :subtract interchangelby
page.driver.browser.action.send_keys([:control, '-'])
.perform

find(%{html}).send_keys [:control, '-']

page.driver.browser.action.key_down(:control)
.send_keys('-')
.perform
```

## Environment
|property|value|data|
|:------|:------:|------|
|ruby|3.0.0||
|capybara|3.35.3|| 
<!-- isnt there are newer capybara version instruct us on how to get it installed -->
|selenium-webdriver|3.142.7||
||||
||||
||||

## Files
<!-- paste snippets as well as upload files -->




<!--- How has this issue affected you? What are you trying to accomplish? -->
<!--- Providing context helps us come up with a solution that is most useful in the real world -->

<!--- Provide a general summary of the issue in the Title above -->

## Detailed Description
<!--- Provide a detailed description of the change or addition you are proposing -->

## Possible Implementation
<!--- Not obligatory, but suggest an idea for implementing addition or change -->
