import React from "react";
import { ApiHelper } from "../helpers";
import { PersonInterface } from "../interfaces"
import { Table, Button, FormControl, InputGroup } from "react-bootstrap";

interface Props {
    addFunction: (person: PersonInterface) => void,
    person?: PersonInterface,
    getPhotoUrl: (person: PersonInterface) => string,
    searchClicked?: () => void,
}

export const PersonAdd: React.FC<Props> = (props) => {
  const [searchResults, setSearchResults] = React.useState<PersonInterface[]>(null);
  const [searchText, setSearchText] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { e.preventDefault(); setSearchText(e.currentTarget.value); }
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(null); } }
  const handleSearch = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = escape(searchText.trim());
    ApiHelper.get("/people/search?term=" + term, "MembershipApi")
      .then(data => {
        setSearchResults(data);
        if (props.searchClicked) {
          props.searchClicked();
        }
      });
  }
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let idx = anchor.getAttribute("data-index");
    let sr: PersonInterface[] = [...searchResults];
    let person: PersonInterface = sr.splice(parseInt(idx), 1)[0];
    setSearchResults(sr);
    props.addFunction(person);
  }

  let rows = [];
  if (searchResults !== null) {
    for (let i = 0; i < searchResults.length; i++) {
      let sr = searchResults[i];
      rows.push(
        <tr key={sr.id}>
          <td><img src={props.getPhotoUrl(sr)} alt="avatar" /></td>
          <td>{sr.name.display}</td>
          <td><a className="text-success" data-cy="add-to-list" data-index={i} href="about:blank" onClick={handleAdd}><i className="fas fa-user"></i> Add</a></td>
        </tr>,
      );
    }
  }

  return (
    <>
      <InputGroup>
        <FormControl id="personAddText" data-cy="person-search-bar" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} />
        <div className="input-group-append"><Button data-cy="person-search-button" id="personAddButton" variant="primary" onClick={handleSearch}><i className="fas fa-search"></i> Search</Button></div>
      </InputGroup>
      <Table size="sm" id="householdMemberAddTable"><tbody>{rows}</tbody></Table>
    </>
  );
}
