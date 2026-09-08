# User build prompts

## 1. Original application and critic-loop request

I want you to build an emulation of the HP-15C calculator.  It should support all the calculation functionality of the HP-15C, but it does not need to be programmable.  I want you to generate image assets for the keys and display of the calculator that look exactly like the original.   Do enough research about the original to write a comprehensive spec for the application.  We will build the app in several stages.  First stage, should display the calculator and support basic arithmetic operations.    While the display should show the complete keyboard layout with all functions, the functions do not need to do anything for the initial version of the app.

When you are finished I want you to invoke a critic agent and give it instructions to test both the look and the functionality of the application.   The critic should find images of the original and do a detailed comparison of the app to the original.  It should re-use the research gathered by the developer agent to decide what it should test.  The agent critically review all aspects of the app and should calculate a score for the accuracy of the visual presentation on a scale of 1 to 10.   It should compute a second score for the accuracy of the calculator functionality, again on a scale of 1 to 10.   Unless both scores are a 9.0 or better the agent should create a list of corrections that need to be made to the application and return that list to the developer agent.   The developer agent should then start another build/verify pass to fix the issues identified by the critic.

Continue this develop / evaluate loop until either both scores exceed the 9.0 threshold, or until 3 iterations have been completed.   At that point stop and let me test the app manually.

Ask any questions you have before starting this task.

## 2. Workspace and historical-model decisions

1 - let's create a new workspace and git repo in /Users/ckolbegger/src/hp-15c.  Do all of your work there.  Include an artifacts folder where you can store the research you did so that I can review any functionality that I think is not 100% correct.

2 - Yes, I want the classic 1982 HP-15C in all of its glory.   I do not have a particular reference photo in mind.  Please find a few and record them in the research folder.

3 - Your proposal for stage one is exactly what I wanted.   Please do that.

## 3. Visual-reference feedback

What are you doing right now?  I am a little concerned.   You mention a reference photo establishing the exact key layout and proportions, but the images you have shown are of what look like buttons, rather than the whole calculator.

## 4. Continue critic corrections and implement scientific functions

Okay - Usage has reset.  Please continue working on the calculator.   Finish any fixes the critic wanted and then start working on implementing the various function keys (alone, with f depressed, and with g depressed).   Choose a set of functions to add for each implementation pass and have the critic agent check the functionality and the math.
