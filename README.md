# Testing

### What is `jest.fn()`?

`jest.fn()` is a **Jest utility** used to **create a mock function** — a **fake function** that lets you:

1. **Track** if and how it was called (e.g., how many times, with what arguments).
2. **Control** what it returns when it's called.
3. **Replace** real functions during testing.

### Why Use `jest.fn()`?

When writing unit tests, you often don’t want to call the real implementation of a function — especially if it:

* Talks to a **database**
* Calls an **API**
* Has **side effects** (e.g., writing files)

| Feature         | Example                              | Meaning                                  |
| --------------- | ------------------------------------ | ---------------------------------------- |
| Create mock     | `jest.fn()`                        | Create a fake function                   |
| Spy on calls    | `toHaveBeenCalled()`               | Check if it was called                   |
| Count calls     | `toHaveBeenCalledTimes(n)`         | Was it called n times?                   |
| Check arguments | `toHaveBeenCalledWith(arg1, arg2)` | Was it called with these args?           |
| Return value    | `.mockReturnValue(value)`          | Always return this value                 |
| Return promise  | `.mockResolvedValue(value)`        | Always resolve a promise with this value |

1. Create a mock and check if it was called

```ts
const mockFunction = jest.fn();

mockFunction(); // call it

expect(mockFunction).toHaveBeenCalled(); // passes

```

2. Check how many times it was called

```ts
mockFunction();
mockFunction();

expect(mockFunction).toHaveBeenCalledTimes(2);

```

3. Check the arguments it was called with

```ts
mockFunction('hello', 123);

expect(mockFunction).toHaveBeenCalledWith('hello', 123);

```

4. Control the return value

```ts
const mockReturn = jest.fn().mockReturnValue('Test Value');

console.log(mockReturn()); // 'Test Value'

```

5. Async version: `mockResolvedValue`

```ts
const fetchData = jest.fn().mockResolvedValue({ name: 'Alice' });

const result = await fetchData();
console.log(result); // { name: 'Alice' }

```


# Unit Tests

we will mock all the database methods 

1. db.insert
2. db.query
3. db.update
4. db.delete

## CreateUser Service

* Should call [db.insert](vscode-file://vscode-app/c:/Users/BrianKemboi/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) with the correct user data.
* Should return `"User Created Successfully"` on success.
* Should throw or return `null` if [db.insert](vscode-file://vscode-app/c:/Users/BrianKemboi/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) fails (simulate DB error).


## User Login Service

* Should call [db.query.UsersTable.findFirst](vscode-file://vscode-app/c:/Users/BrianKemboi/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) with the correct email.
* Should return user data if found.
* Should return `null` if user is not found.
* Should throw if the DB query fails (simulate DB error).


## CreateTodo Service

* Should call [db.insert](vscode-file://vscode-app/c:/Users/BrianKemboi/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) with the correct todo data.
* Should return the inserted todo object (including its ID).
* Should return `null` if insertion fails (simulate DB error).

## getTodosService

* Should call [db.query.TodoTable.findMany](vscode-file://vscode-app/c:/Users/BrianKemboi/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).
* Should return an array of todos.
* Should return an empty array if no todos exist.
* Should throw if the DB query fails.

## getTodoByIdService

* Should call [db.query.TodoTable.findFirst](vscode-file://vscode-app/c:/Users/BrianKemboi/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) with the correct ID.
* Should return the todo if found.
* Should return `undefined` if not found.
* Should throw if the DB query fails.

## updateTodoService

* Should call [db.update](vscode-file://vscode-app/c:/Users/BrianKemboi/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) with the correct ID and data.

* Should return `"Todo Updated Successfully"` on success.
* Should throw if the update fails.

## deleteTodoService

* Should call [db.delete](vscode-file://vscode-app/c:/Users/BrianKemboi/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) with the correct ID.
* Should return `"Todo deleted Successfully"` on success.
* Should throw if the delete fails.


Tests.....
